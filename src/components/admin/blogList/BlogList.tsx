// src/components/BlogList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	collection,
	query,
	where,
	orderBy,
	limit,
	getDocs,
	startAfter,
	DocumentData,
	QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../../utils/firebase/config";
import { useBlogManagement } from "../../../hooks/useBlogManagement";
import { BlogPost } from "../types/blogPostType";

const BlogList: React.FC = () => {
	const {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		loading: hookLoading,
		error: hookError,
		deleteBlogPost,
		togglePublishStatus,
	} = useBlogManagement();

	const [blogs, setBlogs] = useState<BlogPost[]>([]);
	const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Pagination states
	const [lastVisible, setLastVisible] =
		useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [isFirstPage, setIsFirstPage] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const ITEMS_PER_PAGE = 10;

	// Fetch paginated blogs
	const fetchBlogs = async (isFirstLoad = false) => {
		setLoading(true);
		setError(null);

		try {
			let q;
			const blogsRef = collection(db, "blogs");

			// Build query based on filter
			if (filter === "published") {
				q = query(
					blogsRef,
					where("publishedStatus", "==", "published"),
					orderBy("updatedAt", "desc"),
					limit(ITEMS_PER_PAGE)
				);
			} else if (filter === "draft") {
				q = query(
					blogsRef,
					where("publishedStatus", "==", "draft"),
					orderBy("updatedAt", "desc"),
					limit(ITEMS_PER_PAGE)
				);
			} else {
				q = query(
					blogsRef,
					orderBy("updatedAt", "desc"),
					limit(ITEMS_PER_PAGE)
				);
			}

			// If not first load, use startAfter for pagination
			if (!isFirstLoad && lastVisible) {
				if (filter === "published") {
					q = query(
						blogsRef,
						where("publishedStatus", "==", "published"),
						orderBy("updatedAt", "desc"),
						startAfter(lastVisible),
						limit(ITEMS_PER_PAGE)
					);
				} else if (filter === "draft") {
					q = query(
						blogsRef,
						where("publishedStatus", "==", "draft"),
						orderBy("updatedAt", "desc"),
						startAfter(lastVisible),
						limit(ITEMS_PER_PAGE)
					);
				} else {
					q = query(
						blogsRef,
						orderBy("updatedAt", "desc"),
						startAfter(lastVisible),
						limit(ITEMS_PER_PAGE)
					);
				}
			}

			const querySnapshot = await getDocs(q);

			// Check if there are more results
			setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

			// Store the last document for next pagination
			const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			setLastVisible(lastDoc || null);

			// Transform data
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
		} catch (err) {
			setError("Error fetching blogs");
			console.error("Error fetching blogs:", err);
		} finally {
			setLoading(false);
		}
	};

	// Load first page when filter changes
	useEffect(() => {
		fetchBlogs(true);
	}, [filter]);

	// Handle "Load more" action
	const handleLoadMore = () => {
		fetchBlogs(false);
	};

	// Handle "Back to first page" action
	const handleBackToFirst = () => {
		fetchBlogs(true);
	};

	// Handle blog deletion
	const handleDeleteBlog = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this blog post?")) {
			setActionLoading(id);
			try {
				await deleteBlogPost(id);
				setBlogs((prev) => prev.filter((blog) => blog.id !== id));
			} catch (err) {
				console.error("Error deleting blog:", err);
			} finally {
				setActionLoading(null);
			}
		}
	};

	// Handle publish/unpublish toggle
	const handleTogglePublish = async (
		id: string,
		currentStatus: "draft" | "published"
	) => {
		setActionLoading(id);
		try {
			const newStatus = currentStatus === "published" ? "draft" : "published";
			await togglePublishStatus(id, newStatus);

			// Update local state
			setBlogs((prev) =>
				prev.map((blog) =>
					blog.id === id ? { ...blog, publishedStatus: newStatus } : blog
				)
			);
		} catch (err) {
			console.error("Error toggling publish status:", err);
		} finally {
			setActionLoading(null);
		}
	};

	// Format date for display
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const formatDate = (date: any) => {
		if (!date) return "N/A";

		if (typeof date === "object" && date.toDate) {
			// Handle Firestore Timestamp
			return date.toDate().toLocaleDateString();
		}

		return new Date(date).toLocaleDateString();
	};

	return (
		<div className="blog-list-container">
			<div className="blog-list-header">
				<h1>Blog Management</h1>
				<Link to="/admin/blogs/new" className="create-blog-button">
					Create New Blog
				</Link>
			</div>

			<div className="blog-filter">
				<button
					className={filter === "all" ? "active" : ""}
					onClick={() => setFilter("all")}
				>
					All
				</button>
				<button
					className={filter === "published" ? "active" : ""}
					onClick={() => setFilter("published")}
				>
					Published
				</button>
				<button
					className={filter === "draft" ? "active" : ""}
					onClick={() => setFilter("draft")}
				>
					Drafts
				</button>
			</div>

			{(error || hookError) && (
				<div className="error-message">{error || hookError}</div>
			)}

			{loading && blogs.length === 0 ? (
				<div className="loading">Loading blogs...</div>
			) : blogs.length === 0 ? (
				<div className="no-blogs">No blog posts found</div>
			) : (
				<>
					<div className="blog-table-container">
						<table className="blog-table">
							<thead>
								<tr>
									<th>Title</th>
									<th>Status</th>
									<th>Last Updated</th>
									<th>Created Date</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{blogs.map((blog) => (
									<tr key={blog.id}>
										<td>
											<div className="blog-title">
												{blog.title}
												{blog.coverImage && (
													<span className="has-image-indicator">📷</span>
												)}
											</div>
										</td>
										<td>
											<span className={`status-badge ${blog.publishedStatus}`}>
												{blog.publishedStatus}
											</span>
										</td>
										<td>{formatDate(blog.updatedAt)}</td>
										<td>{formatDate(blog.createdAt)}</td>
										<td>
											<div className="blog-actions">
												<Link
													to={`/admin/blogs/edit/${blog.id}`}
													className="edit-button"
												>
													Edit
												</Link>

												<button
													className={`publish-button ${
														blog.publishedStatus === "published"
															? "unpublish"
															: "publish"
													}`}
													onClick={() =>
														handleTogglePublish(blog.id, blog.publishedStatus)
													}
													disabled={actionLoading === blog.id}
												>
													{actionLoading === blog.id
														? "..."
														: blog.publishedStatus === "published"
														? "Unpublish"
														: "Publish"}
												</button>

												<button
													className="delete-button"
													onClick={() => handleDeleteBlog(blog.id)}
													disabled={actionLoading === blog.id}
												>
													{actionLoading === blog.id ? "..." : "Delete"}
												</button>

												{blog.publishedStatus === "published" && (
													<a
														href={`/blog/${blog.slug}`}
														target="_blank"
														rel="noopener noreferrer"
														className="view-button"
													>
														View
													</a>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination controls */}
					<div className="pagination-controls">
						{!isFirstPage && (
							<button
								className="pagination-button"
								onClick={handleBackToFirst}
								disabled={loading}
							>
								Back to First Page
							</button>
						)}

						{hasMore && (
							<button
								className="pagination-button load-more"
								onClick={handleLoadMore}
								disabled={loading}
							>
								{loading ? "Loading..." : "Load More"}
							</button>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default BlogList;
