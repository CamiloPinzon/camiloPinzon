import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase/config";
import { UserContext } from "../../../contexts/user.context";
import { useBlogManagement } from "../../../hooks/useBlogManagement";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import { BlogPost } from "../types/blogPostType";

import "./blogForm.scss";

interface FormData {
	lng: "en" | "es";
	title: string;
	slug: string;
	summary: string;
	content: string;
	tags: string;
	coverImage: File | null;
	pairId?: string;
}

const BlogForm = () => {
	const { id } = useParams<{ id: string }>();
	const isEditMode = Boolean(id);
	const navigate = useNavigate();
	const { currentUser } = useContext(UserContext);

	const { loading, error, uploadImage, createBlogPost, updateBlogPost } =
		useBlogManagement();

	const [formData, setFormData] = useState<FormData>({
		lng: "en",
		title: "",
		slug: "",
		summary: "",
		content: "",
		tags: "",
		coverImage: null,
		pairId: "",
	});

	const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
		null
	);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	// Fetch blog post data if in edit mode
	useEffect(() => {
		const fetchBlogPost = async () => {
			if (id) {
				try {
					const docRef = doc(db, "blogs", id);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const data = docSnap.data() as BlogPost;
						setFormData({
							lng: data.lng,
							title: data.title,
							slug: data.slug,
							summary: data.summary,
							content: data.content,
							tags: data.tags.join(", "),
							coverImage: null,
						});

						if (data.coverImage) {
							setCoverImagePreview(data.coverImage);
						}
					} else {
						setFormError("Blog post not found");
					}
				} catch (err) {
					console.error("Error fetching blog post:", err);

					setFormError("Error fetching blog post");
				}
			}
		};

		fetchBlogPost();
	}, [id]);

	// Handle input changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleLngChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const lng = event.target.value as "en" | "es";
		setFormData((prev) => ({ ...prev, lng }));
	};

	// Handle rich text editor changes
	const handleContentChange = useCallback((content: string) => {
		setFormData((prev) => ({ ...prev, content }));
	}, []);

	// Handle slug generation from title
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		setFormData((prev) => ({
			...prev,
			title,
			slug: title
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]+/g, ""),
		}));
	};

	// Handle cover image selection
	const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setFormData((prev) => ({ ...prev, coverImage: file }));

			// Create preview
			const reader = new FileReader();
			reader.onload = () => {
				setCoverImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitLoading(true);
		setFormError(null);

		try {
			// Validate form
			if (!formData.title || !formData.content) {
				throw new Error("Title and content are required");
			}

			let coverImageUrl = coverImagePreview;

			// Upload cover image if new one was selected
			if (formData.coverImage) {
				coverImageUrl = await uploadImage(formData.coverImage);
			}

			const date = new Date();
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
			const year = date.getFullYear();

			const formattedDate = `${day}${month}${year}`;

			// Prepare blog post data
			const blogPostData = {
				lng: formData.lng,
				title: formData.title,
				slug: formData.slug,
				pairId: `${formData.lng}_${formattedDate}`,
				summary: formData.summary,
				content: formData.content,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				coverImage: coverImageUrl || "",
				images: coverImageUrl ? [coverImageUrl] : [],
				publishedStatus: "draft" as const,
				author: {
					id: currentUser?.id || "",
					name: currentUser?.displayName || "Anonymous",
				},
			};

			if (isEditMode && id) {
				// Update existing blog post
				await updateBlogPost(id, blogPostData);
			} else {
				// Create new blog post
				await createBlogPost(blogPostData);
			}

			// Redirect to blog list after successful submit
			navigate("/admin/blogs");
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setSubmitLoading(false);
		}
	};

	return (
		<div className="blog-form">
			<h1 className="blog-form__title">
				{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
			</h1>

			{formError && <div className="blog-form__error">{formError}</div>}
			{error && <div className="blog-form__error">{error}</div>}

			<form className="blog-form__form" onSubmit={handleSubmit}>
				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="lng">
						Language
					</label>
					<select
						className="blog-form__select"
						id="lng"
						name="lng"
						value={formData.lng}
						onChange={handleLngChange}
						required
					>
						<option value="en">English</option>
						<option value="es">Spanish</option>
					</select>
					<label className="blog-form__label" htmlFor="title">
						Title
					</label>
					<input
						className="blog-form__input"
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleTitleChange}
						required
					/>
				</div>

				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="slug">
						Slug
					</label>
					<input
						className="blog-form__input"
						type="text"
						id="slug"
						name="slug"
						value={formData.slug}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="summary">
						Summary
					</label>
					<textarea
						className="blog-form__textarea"
						id="summary"
						name="summary"
						value={formData.summary}
						onChange={handleChange}
						rows={3}
					/>
				</div>

				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="coverImage">
						Cover Image
					</label>
					<input
						className="blog-form__file-input"
						type="file"
						id="coverImage"
						accept="image/*"
						onChange={handleCoverImageChange}
					/>
					{coverImagePreview && (
						<div className="blog-form__image-preview">
							<img
								className="blog-form__preview-img"
								src={coverImagePreview}
								alt="Cover preview"
								style={{ maxWidth: "300px" }}
							/>
						</div>
					)}
				</div>

				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="content">
						Content
					</label>
					<div className="blog-form__rich-editor-container">
						<RichTextEditor
							value={formData.content}
							onChange={handleContentChange}
						/>
					</div>
				</div>

				<div className="blog-form__group">
					<label className="blog-form__label" htmlFor="tags">
						Tags (comma separated)
					</label>
					<input
						className="blog-form__input"
						type="text"
						id="tags"
						name="tags"
						value={formData.tags}
						onChange={handleChange}
						placeholder="e.g. React, TypeScript, Web Development"
					/>
				</div>

				<div className="blog-form__actions">
					<button
						className="blog-form__button blog-form__button--cancel"
						type="button"
						onClick={() => navigate("/admin/blogs")}
						disabled={submitLoading}
					>
						Cancel
					</button>
					<button
						className="blog-form__button blog-form__button--submit"
						type="submit"
						disabled={submitLoading || loading}
					>
						{submitLoading
							? "Saving..."
							: isEditMode
							? "Update Blog Post"
							: "Create Blog Post"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default BlogForm;
