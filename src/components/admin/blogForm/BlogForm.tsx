import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase/config";
import { UserContext } from "../../../contexts/user.context";
import { useBlogManagement } from "../../../hooks/useBlogManagement";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import { BlogPost } from "../types/blogPostType";

interface FormData {
	title: string;
	slug: string;
	summary: string;
	content: string;
	tags: string;
	coverImage: File | null;
}

const BlogForm: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const isEditMode = Boolean(id);
	const navigate = useNavigate();
	const { currentUser } = useContext(UserContext);

	const { loading, error, uploadImage, createBlogPost, updateBlogPost } =
		useBlogManagement();

	const [formData, setFormData] = useState<FormData>({
		title: "",
		slug: "",
		summary: "",
		content: "",
		tags: "",
		coverImage: null,
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

	// Handle rich text editor changes
	const handleContentChange = (content: string) => {
		setFormData((prev) => ({ ...prev, content }));
	};

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

			// Prepare blog post data
			const blogPostData = {
				title: formData.title,
				slug: formData.slug,
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
		<div className="blog-form-container">
			<h1>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>

			{formError && <div className="error-message">{formError}</div>}
			{error && <div className="error-message">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleTitleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="slug">Slug</label>
					<input
						type="text"
						id="slug"
						name="slug"
						value={formData.slug}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="summary">Summary</label>
					<textarea
						id="summary"
						name="summary"
						value={formData.summary}
						onChange={handleChange}
						rows={3}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="coverImage">Cover Image</label>
					<input
						type="file"
						id="coverImage"
						accept="image/*"
						onChange={handleCoverImageChange}
					/>
					{coverImagePreview && (
						<div className="image-preview">
							<img
								src={coverImagePreview}
								alt="Cover preview"
								style={{ maxWidth: "300px" }}
							/>
						</div>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="content">Content</label>
					<RichTextEditor
						value={formData.content}
						onChange={handleContentChange}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="tags">Tags (comma separated)</label>
					<input
						type="text"
						id="tags"
						name="tags"
						value={formData.tags}
						onChange={handleChange}
						placeholder="e.g. React, TypeScript, Web Development"
					/>
				</div>

				<div className="form-actions">
					<button
						type="button"
						onClick={() => navigate("/admin/blogs")}
						disabled={submitLoading}
					>
						Cancel
					</button>
					<button type="submit" disabled={submitLoading || loading}>
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
