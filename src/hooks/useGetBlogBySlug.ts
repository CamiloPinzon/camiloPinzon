// useGetBlogBySlug.ts
import { useState, useEffect } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	QueryDocumentSnapshot,
	DocumentData,
} from "firebase/firestore";
import { db } from "../utils/firebase/config";
import { BlogPost, BlogState } from "../components/admin/types/blogPostType";

export const useGetBlogBySlug = (slug: string): BlogState => {
	const [state, setState] = useState<BlogState>({
		blog: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const fetchBlog = async (): Promise<void> => {
			if (!slug) {
				setState((prev: BlogState) => ({
					...prev,
					loading: false,
					error: "No slug provided",
				}));
				return;
			}

			try {
				setState((prev: BlogState) => ({ ...prev, loading: true }));
				// Create a query against the collection
				const blogsRef = collection(db, "blogs"); // Replace 'blogs' with your actual collection name
				const q = query(
					blogsRef,
					where("slug", "==", slug),
					where("publishedStatus", "==", "published")
				);

				const querySnapshot = await getDocs(q);

				if (querySnapshot.empty) {
					setState({
						blog: null,
						loading: false,
						error: "Blog not found",
					});
				} else {
					// We expect only one document with this slug
					const doc: QueryDocumentSnapshot<DocumentData> =
						querySnapshot.docs[0];
					const blogData = doc.data() as Omit<BlogPost, "id">;

					setState({
						blog: { id: doc.id, ...blogData },
						loading: false,
						error: null,
					});
				}
			} catch (err) {
				console.error("Error fetching blog:", err);
				setState({
					blog: null,
					loading: false,
					error:
						err instanceof Error ? err.message : "An unknown error occurred",
				});
			}
		};

		fetchBlog();
	}, [slug]);

	return state;
};
