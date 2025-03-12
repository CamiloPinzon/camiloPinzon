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

import "./blogList.scss";

const BlogList: React.FC = () => {
	const {
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
			const blogsRef = collection(db, "blogs");
			const queryConstraints = [];

			// Add filter constraint if specified
			if (filter === "published" || filter === "draft") {
				queryConstraints.push(where("publishedStatus", "==", filter));
			}

			// Always order by updatedAt
			queryConstraints.push(orderBy("updatedAt", "desc"));

			// Add pagination constraint if not first load
			if (!isFirstLoad && lastVisible) {
				queryConstraints.push(startAfter(lastVisible));
			}

			// Add limit
			queryConstraints.push(limit(ITEMS_PER_PAGE));

			// Build the query with all constraints
			const q = query(blogsRef, ...queryConstraints);
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
		<div className="blog-list">
			<div className="blog-list__header">
				<h1 className="blog-list__title">Blog Management</h1>
				<Link to="/admin/blogs/new" className="blog-list__create-button">
					Create New Blog
				</Link>
			</div>

			<div className="blog-list__filters">
				<button
					className={`blog-list__filter-button ${
						filter === "all" ? "blog-list__filter-button--active" : ""
					}`}
					onClick={() => setFilter("all")}
				>
					All
				</button>
				<button
					className={`blog-list__filter-button ${
						filter === "published" ? "blog-list__filter-button--active" : ""
					}`}
					onClick={() => setFilter("published")}
				>
					Published
				</button>
				<button
					className={`blog-list__filter-button ${
						filter === "draft" ? "blog-list__filter-button--active" : ""
					}`}
					onClick={() => setFilter("draft")}
				>
					Drafts
				</button>
			</div>

			{(error || hookError) && (
				<div className="blog-list__error">{error || hookError}</div>
			)}

			{loading && blogs.length === 0 ? (
				<div className="blog-list__loading">Loading blogs...</div>
			) : blogs.length === 0 ? (
				<div className="blog-list__empty">No blog posts found</div>
			) : (
				<>
					<div className="blog-list__table-container">
						<table className="blog-list__table">
							<thead className="blog-list__table-head">
								<tr className="blog-list__table-row">
									<th className="blog-list__table-header">Title</th>
									<th className="blog-list__table-header">Status</th>
									<th className="blog-list__table-header">Last Updated</th>
									<th className="blog-list__table-header">Created Date</th>
									<th className="blog-list__table-header">Actions</th>
								</tr>
							</thead>
							<tbody className="blog-list__table-body">
								{blogs.map((blog) => (
									<tr key={blog.id} className="blog-list__table-row">
										<td className="blog-list__table-cell">
											<div className="blog-list__blog-title">
												{blog.title}
												{blog.coverImage && (
													<span className="blog-list__image-indicator">📷</span>
												)}
											</div>
										</td>
										<td className="blog-list__table-cell">
											<span
												className={`blog-list__status-badge blog-list__status-badge--${blog.publishedStatus}`}
											>
												{blog.publishedStatus}
											</span>
										</td>
										<td className="blog-list__table-cell">
											{formatDate(blog.updatedAt)}
										</td>
										<td className="blog-list__table-cell">
											{formatDate(blog.createdAt)}
										</td>
										<td className="blog-list__table-cell">
											<div className="blog-list__actions">
												<Link
													to={`/admin/blogs/edit/${blog.id}`}
													className="blog-list__action-button blog-list__action-button--edit"
												>
													Edit
												</Link>

												<button
													className={`blog-list__action-button blog-list__action-button--${
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
													className="blog-list__action-button blog-list__action-button--delete"
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
														className="blog-list__action-button blog-list__action-button--view"
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
					<div className="blog-list__pagination">
						{!isFirstPage && (
							<button
								className="blog-list__pagination-button blog-list__pagination-button--first"
								onClick={handleBackToFirst}
								disabled={loading}
							>
								Back to First Page
							</button>
						)}

						{hasMore && (
							<button
								className="blog-list__pagination-button blog-list__pagination-button--more"
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
