import { useState, useEffect } from "react";
import {
	collection,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	getDocs,
	QueryDocumentSnapshot,
	DocumentData,
	Timestamp,
	FirestoreError,
} from "firebase/firestore";
import { db } from "../utils/firebase/config";

// Define proper types for Firestore Timestamp
export type FirestoreDate = Timestamp;

export type BlogPost = {
	id: string;
	publishedStatus: "published" | "draft";
	updatedAt: FirestoreDate;
	createdAt: FirestoreDate;
	title: string;
	content: string;
	summary?: string;
	coverImage?: string;
	slug: string;
	// Add other blog post properties here
};

export type BlogFilter = "all" | "published" | "draft";

interface UseFetchBlogsOptions {
	publishedOnly?: boolean;
	initialFilter?: BlogFilter;
	itemsPerPage?: number;
	latest?: boolean;
}

export const useFetchBlogs = (options: UseFetchBlogsOptions = {}) => {
	const {
		publishedOnly = false,
		initialFilter = "all",
		itemsPerPage = 10,
		latest = false,
	} = options;

	// If publishedOnly is true, force the filter to be 'published'
	const effectiveInitialFilter = publishedOnly ? "published" : initialFilter;

	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [filter, setFilter] = useState<BlogFilter>(effectiveInitialFilter);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Pagination states
	const [lastVisible, setLastVisible] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [isFirstPage, setIsFirstPage] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const ITEMS_PER_PAGE = itemsPerPage;

	// Custom filter setter that respects the publishedOnly option
	const setFilterSafe = (newFilter: BlogFilter) => {
		if (publishedOnly && newFilter !== "published") {
			console.warn(
				"This instance is configured for published blogs only. Filter not changed."
			);
			return;
		}
		setFilter(newFilter);
	};

	// Fetch paginated blogs
	const fetchBlogs = async (isFirstLoad = false) => {
		setLoading(true);
		setError(null);

		try {
			const blogsRef = collection(db, "blogs");
			let q;

			// Simplified query building
			const filterConditions = [];

			// Add the ordering first (required for all queries)
			filterConditions.push(orderBy("updatedAt", "desc"));

			// Add pagination if needed
			if (!isFirstLoad && lastVisible) {
				filterConditions.push(startAfter(lastVisible));
			}

			// Add limit (required for all queries)
			filterConditions.push(limit(ITEMS_PER_PAGE));

			// If publishedOnly is true, we only care about published posts
			if (publishedOnly || filter === "published") {
				// Create a query for published blogs
				q = query(
					blogsRef,
					where("publishedStatus", "==", "published"),
					...filterConditions,
					...(latest === true ? [limit(3)] : [])
				);
			} else if (filter === "draft") {
				// Create a query for draft blogs
				q = query(
					blogsRef,
					where("publishedStatus", "==", "draft"),
					...filterConditions
				);
			} else {
				// No filter, show all blogs
				q = query(blogsRef, ...filterConditions);
			}

			const querySnapshot = await getDocs(q);

			// Check if there are more results
			setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

			// Store the last document for next pagination
			const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			setLastVisible(lastDoc || null);

			// Transform data with proper typing
			const blogData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as BlogPost[];

			// Update blogs state
			if (isFirstLoad) {
				setBlogs(blogData);
			} else {
				setBlogs((prev) => [...prev, ...blogData]);
			}

			// Update first page state
			setIsFirstPage(isFirstLoad);
		} catch (error) {
			console.error("Error fetching blogs:", error);

			// Get more details from FirebaseError
			if (error instanceof FirestoreError) {
				console.error("Firebase error code:", error.code);
				console.error("Error message:", error.message);

				// Check if it's a missing index error
				if (error.message.includes("index")) {
					console.error("This is an index error - create the required index");
				}
			}

			setError("Error fetching blogs");
		} finally {
			setLoading(false);
		}
	};

	// Load first page when filter changes
	useEffect(() => {
		fetchBlogs(true);
	}, [filter]);

	// Initial load
	useEffect(() => {
		fetchBlogs(true);
	}, []);

	// Handle "Load more" action
	const handleLoadMore = () => {
		fetchBlogs(false);
	};

	// Handle "Back to first page" action
	const handleBackToFirst = () => {
		fetchBlogs(true);
	};

	// Format date for display with proper typing
	const formatDate = (
		date: FirestoreDate | Date | string | null | undefined
	): string => {
		if (!date) return "N/A";

		if (typeof date === "object") {
			if ("toDate" in date && typeof date.toDate === "function") {
				// Handle Firestore Timestamp
				return date.toDate().toLocaleDateString();
			} else if (date instanceof Date) {
				// Handle JavaScript Date object
				return date.toLocaleDateString();
			}
		}

		if (typeof date === "string") {
			// Handle date string
			return new Date(date).toLocaleDateString();
		}

		return "Invalid Date";
	};

	return {
		blogs,
		loading,
		error,
		hasMore,
		isFirstPage,
		filter,
		setFilter: setFilterSafe,
		handleLoadMore,
		handleBackToFirst,
		formatDate,
		publishedOnly,
	};
};
