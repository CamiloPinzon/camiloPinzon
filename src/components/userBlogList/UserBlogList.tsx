import Card from "../card/Card";
import { useFetchBlogs } from "../../hooks/useFetchBlogs";

import "./userBlog.scss";

interface UserBlogListProps {
	className?: string;
	title?: string;
	itemsPerPage?: number;
	latest?: boolean;
}

const UserBlogList: React.FC<UserBlogListProps> = ({
	className = "",
	title = "Latest Blog Posts",
	itemsPerPage = 6,
	latest = false,
}) => {
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
		latest,
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
				<Card>
					<div key={blog.id} className="blog-list__item">
						<img
							className="blog-list__item-image"
							src={blog.coverImage}
							alt={blog.title}
						/>
						<div className="blog-list__content">
							<h3 className="blog-list__item-title">{blog.title}</h3>
							<p className="blog-list__item-date">
								Posted on: {formatDate(blog.createdAt)}
							</p>
							<p className="blog-list__item-excerpt">
								{blog.summary || blog.content.substring(0, 150)}...
							</p>
							<a className="blog-list__item-link" href={`/blogs/${blog.slug}`}>
								Read More
							</a>
						</div>
					</div>
				</Card>
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
