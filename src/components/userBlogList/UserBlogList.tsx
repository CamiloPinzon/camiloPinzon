import { FC } from "react";
import { useFetchBlogs } from "../../hooks/useFetchBlogs";

interface UserBlogListProps {
	className?: string;
	title?: string;
	itemsPerPage?: number;
}

const UserBlogList: FC<UserBlogListProps> = ({
	className = "",
	title = "Latest Blog Posts",
	itemsPerPage = 6,
}) => {
	// Use the publishedOnly option to restrict to published posts only
	const {
		blogs,
		loading,
		error,
		hasMore,
		isFirstPage,
		handleLoadMore,
		handleBackToFirst,
		formatDate,
	} = useFetchBlogs({
		publishedOnly: true,
		itemsPerPage,
	});

	if (loading && blogs.length === 0) {
		return (
			<div className={`blog-list-loading ${className}`}>
				Loading blog posts...
			</div>
		);
	}

	if (error) {
		return (
			<div className={`blog-list-error ${className}`}>
				Error loading blog posts: {error}
			</div>
		);
	}

	return (
		<div className={`blog-list ${className}`}>
			<h2>{title}</h2>

			{blogs.map((blog) => (
				<div key={blog.id} className="blog-card">
					<img src={blog.coverImage} alt={blog.title} />
					<h3>{blog.title}</h3>
					<p className="blog-date">Posted on: {formatDate(blog.createdAt)}</p>
					<p className="blog-excerpt">
						{blog.summary || blog.content.substring(0, 150)}...
					</p>
					<a href={`/blogs/${blog.id}`}>Read More</a>
				</div>
			))}

			{blogs.length === 0 && (
				<p className="no-blogs-message">No blog posts available.</p>
			)}

			{/* Pagination controls */}
			<div className="pagination-controls">
				{!isFirstPage && (
					<button
						className="back-to-first-btn"
						onClick={handleBackToFirst}
						type="button"
					>
						Back to First Page
					</button>
				)}

				{hasMore && (
					<button
						className="load-more-btn"
						onClick={handleLoadMore}
						disabled={loading}
						type="button"
					>
						{loading ? "Loading more posts..." : "Load More Posts"}
					</button>
				)}
			</div>
		</div>
	);
};

export default UserBlogList;
