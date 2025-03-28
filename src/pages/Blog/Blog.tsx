import { useParams } from "react-router-dom";

import Tags from "../../components/tags/Tags";
import SharePost from "../../components/sharePost/SharePost";
import Modal from "../../components/modal/Modal";
import { useGetBlogBySlug } from "../../hooks/useGetBlogBySlug";
import { useSEO } from "../../hooks/useSEO";

import "./blog.scss";
import "react-quill-new/dist/quill.snow.css";

interface RouteParams {
	slug: string;
}

const Blog = () => {
	const params = useParams<keyof RouteParams>();
	const slug = params.slug || "";
	const { blog, loading, error } = useGetBlogBySlug(slug);

	useSEO({
		title: blog ? blog.title : "Loading Blog...",
		description: blog ? blog.summary : "Blog content is loading",
		image: blog?.coverImage,
	});

	if (loading) {
		return <Modal isOpen={true} onClose={() => {}} type="loader" />;
	}

	if (error) return <div>Error: {error}</div>;
	if (!blog) return <div>Blog not found</div>;

	const currentUrl = window.location.origin + location.pathname;

	return (
		<div className="blog">
			<h1 className="blog__title">{blog.title}</h1>
			<div
				className="quill-content"
				dangerouslySetInnerHTML={{ __html: blog.content }}
			/>
			{blog.tags && blog.tags.length > 0 && <Tags tags={blog.tags} />}
			<div className="container">
				<SharePost title={blog.title} url={currentUrl} />
			</div>
		</div>
	);
};

export default Blog;
