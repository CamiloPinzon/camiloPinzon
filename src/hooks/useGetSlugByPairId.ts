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

interface SlugState {
	slug: string | null;
	loading: boolean;
	error: string | null;
}

export const useGetSlugByPairId = (pairId: string): SlugState => {
	const [state, setState] = useState<SlugState>({
		slug: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const fetchSlug = async (): Promise<void> => {
			if (!pairId) {
				setState((prev: SlugState) => ({
					...prev,
					loading: false,
					error: "No pairId provided",
				}));
				return;
			}

			try {
				setState((prev: SlugState) => ({ ...prev, loading: true }));
				// Create a query against the collection
				const blogsRef = collection(db, "blogs");
				const q = query(
					blogsRef,
					where("pairId", "==", pairId),
					where("publishedStatus", "==", "published")
				);

				const querySnapshot = await getDocs(q);

				if (querySnapshot.empty) {
					setState({
						slug: null,
						loading: false,
						error: "Blog not found",
					});
				} else {
					const doc: QueryDocumentSnapshot<DocumentData> =
						querySnapshot.docs[0];
					const blogData = doc.data();

					const slug = blogData.slug as string;

					setState({
						slug,
						loading: false,
						error: null,
					});
				}
			} catch (err) {
				console.error("Error fetching slug:", err);
				setState({
					slug: null,
					loading: false,
					error:
						err instanceof Error ? err.message : "An unknown error occurred",
				});
			}
		};

		fetchSlug();
	}, [pairId]);

	return state;
};
