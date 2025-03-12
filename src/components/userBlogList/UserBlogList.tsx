import { FC } from "react";
import { useFetchBlogs } from "../../hooks/useFetchBlogs";

import "./userBlog.scss";

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
			<h2 className="blog-list__title">{title}</h2>

			{blogs.map((blog) => (
				<div key={blog.id} className="blog-list__card">
					<img
						className="blog-list__card-image"
						src={blog.coverImage}
						alt={blog.title}
					/>
					<h3 className="blog-list__card-title">{blog.title}</h3>
					<p className="blog-list__card-date">
						Posted on: {formatDate(blog.createdAt)}
					</p>
					<p className="blog-list__card-excerpt">
						{blog.summary || blog.content.substring(0, 150)}...
					</p>
					<a className="blog-list__card-link" href={`/blogs/${blog.id}`}>
						Read More
					</a>
				</div>
			))}

			{blogs.length === 0 && (
				<p className="blog-list__empty-message">No blog posts available.</p>
			)}

			{/* Pagination controls */}
			<div className="blog-list__pagination">
				{!isFirstPage && (
					<button
						className="blog-list__pagination-button blog-list__pagination-button--first"
						onClick={handleBackToFirst}
						type="button"
					>
						Back to First Page
					</button>
				)}

				{hasMore && (
					<button
						className="blog-list__pagination-button blog-list__pagination-button--more"
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
