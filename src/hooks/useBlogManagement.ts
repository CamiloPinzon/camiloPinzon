import { useState } from "react";
import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { db } from "../utils/firebase/config";
import { BlogPost } from "../components/admin/types/blogPostType";

export const useBlogManagement = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const uploadImage = async (file: File): Promise<string> => {
		setLoading(true);

		try {
			const base64 = await toBase64(file);

			const response = await fetch("/.netlify/functions/uploadImage", {
				method: "POST",
				body: JSON.stringify({
					image: base64,
					filename: file.name,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to upload image");
			}

			return data.url;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const toBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const createBlogPost = async (
		blogData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
	): Promise<string> => {
		setLoading(true);

		try {
			const newBlogPost = {
				...blogData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const docRef = await addDoc(collection(db, "blogs"), newBlogPost);
			return docRef.id;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateBlogPost = async (
		id: string,
		blogData: Partial<BlogPost>
	): Promise<void> => {
		setLoading(true);

		try {
			const blogRef = doc(db, "blogs", id);
			await updateDoc(blogRef, {
				...blogData,
				updatedAt: new Date(),
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteBlogPost = async (id: string): Promise<void> => {
		setLoading(true);

		try {
			await deleteDoc(doc(db, "blogs", id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const togglePublishStatus = async (
		id: string,
		status: "draft" | "published"
	): Promise<void> => {
		setLoading(true);

		try {
			const blogRef = doc(db, "blogs", id);
			await updateDoc(blogRef, {
				publishedStatus: status,
				publishedDate: status === "published" ? new Date() : null,
				updatedAt: new Date(),
			});

			// Send newsletter notification when publishing
			if (status === "published") {
				try {
					// Get the blog data to send in the notification
					const blogSnapshot = await getDocs(
						query(collection(db, "blogs"), where("__name__", "==", id))
					);

					if (!blogSnapshot.empty) {
						const blogData = blogSnapshot.docs[0].data() as BlogPost;

						// Send notification to newsletter subscribers
						await fetch("/.netlify/functions/send-blog-notification", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								blogData: {
									title: blogData.title,
									slug: blogData.slug,
									summary: blogData.summary,
									coverImage: blogData.coverImage,
									lng: blogData.lng,
								},
							}),
						});

						console.log("✅ Newsletter notification sent successfully");
					}
				} catch (notificationError) {
					// Don't fail the publish operation if notification fails
					console.error(
						"⚠️ Failed to send newsletter notification:",
						notificationError
					);
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const getBlogPosts = async (
		filter?: "all" | "published" | "draft"
	): Promise<BlogPost[]> => {
		setLoading(true);

		try {
			let q;

			if (filter === "published") {
				q = query(
					collection(db, "blogs"),
					where("publishedStatus", "==", "published")
				);
			} else if (filter === "draft") {
				q = query(
					collection(db, "blogs"),
					where("publishedStatus", "==", "draft")
				);
			} else {
				q = collection(db, "blogs");
			}

			const querySnapshot = await getDocs(q);

			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as BlogPost[];
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		uploadImage,
		createBlogPost,
		updateBlogPost,
		deleteBlogPost,
		togglePublishStatus,
		getBlogPosts,
	};
};
