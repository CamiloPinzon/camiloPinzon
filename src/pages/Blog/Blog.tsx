import { useParams } from "react-router-dom";

import SharePost from "../../components/sharePost/SharePost";
import { useGetBlogBySlug } from "../../hooks/useGetBlogBySlug";

import "./blog.scss";

// Define the params interface correctly for useParams
interface RouteParams {
	slug: string;
}

const Blog = () => {
	// Type the useParams hook correctly
	const params = useParams<keyof RouteParams>();
	const slug = params.slug || "";
	const { blog, loading, error } = useGetBlogBySlug(slug);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!blog) return <div>Blog not found</div>;

	const currentUrl = window.location.origin + location.pathname;

	return (
		<div className="blog">
			<h1 className="blog__title">{blog.title}</h1>
			<div
				className="blog__content"
				dangerouslySetInnerHTML={{ __html: blog.content }}
			/>
			{blog.tags && blog.tags.length > 0 && (
				<div className="blog__tags">
					<p className="blog__tags-title">Tags:</p>
					<ul className="blog__tags-list">
						{blog.tags.map((tag, index) => (
							<li key={index} className="blog__tags-item">
								{tag}
							</li>
						))}
					</ul>
				</div>
			)}
			<div className="container">
				<SharePost title={blog.title} url={currentUrl} />
			</div>
		</div>
	);
};

export default Blog;
