import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/config";

import { useTranslation } from "react-i18next";
import { SupportedLanguage } from "../../i18n/languageOptions";

import Tags from "../../components/tags/Tags";
import SharePost from "../../components/sharePost/SharePost";
import Modal from "../../components/modal/Modal";
import { useGetBlogBySlug } from "../../hooks/useGetBlogBySlug";

import "./blog.scss";
import "react-quill-new/dist/quill.snow.css";

interface RouteParams {
	slug: string;
}

const Blog = () => {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language as SupportedLanguage;
	const params = useParams<keyof RouteParams>();
	const slug = params.slug || "";
	const navigate = useNavigate();

	const {
		blog,
		loading: blogLoading,
		error: blogError,
	} = useGetBlogBySlug(slug);
	const [redirectState, setRedirectState] = useState({
		isLoading: false,
		error: null as string | null,
	});

	const isMounted = useRef(true);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!blog) return;
		const blogLng = blog.pairId?.split("_")[0];
		if (currentLanguage === blogLng) return;

		const blogId = blog.pairId?.split("_")[1];
		if (!blogId) return;

		setRedirectState({ isLoading: true, error: null });

		const fetchAndRedirect = async () => {
			try {
				const blogsRef = collection(db, "blogs");
				const q = query(
					blogsRef,
					where("pairId", "==", `${currentLanguage}_${blogId}`),
					where("publishedStatus", "==", "published")
				);

				const querySnapshot = await getDocs(q);

				if (!isMounted.current) return;

				if (querySnapshot.empty) {
					setRedirectState({
						isLoading: false,
						error: "Blog not available in selected language",
					});
				} else {
					const doc = querySnapshot.docs[0];
					const blogData = doc.data();
					const targetSlug = blogData.slug;

					navigate(`/blogs/${targetSlug}`);
					setRedirectState({ isLoading: false, error: null });
				}
			} catch (err) {
				if (isMounted.current) {
					setRedirectState({
						isLoading: false,
						error:
							err instanceof Error ? err.message : "An unknown error occurred",
					});
				}
			}
		};

		fetchAndRedirect();
	}, [blog, currentLanguage]);

	const isLoading = blogLoading || redirectState.isLoading;

	if (isLoading) {
		return <Modal isOpen={true} onClose={() => {}} type="loader" />;
	}

	if (blogError) return <div>Error: {blogError}</div>;
	if (!blog) return <div>Blog not found</div>;
	if (redirectState.error) {
		return <div>Error changing language: {redirectState.error}</div>;
	}

	const currentUrl = window.location.origin + location.pathname;

	return (
		<div className="blog">
			<title>{blog.title}</title>
			<meta name="description" content={blog.summary} />
			<meta property="og:title" content={blog.title} />
			<meta property="og:description" content={blog.summary} />
			<meta property="og:image" content={blog.coverImage} />
			<meta property="og:url" content={currentUrl} />
			<meta property="og:type" content="article" />
			<meta property="og:locale" content={currentLanguage} />
			<meta property="og:site_name" content="Camilo Pinzon" />
			<meta
				property="keywords"
				content={blog.tags?.join(", ")}
				name="keywords"
			/>
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
