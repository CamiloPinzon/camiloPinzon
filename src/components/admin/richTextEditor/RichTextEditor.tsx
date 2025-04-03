import React, { useRef, useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { useBlogManagement } from "../../../hooks/useBlogManagement";

interface RichTextEditorProps {
	value: string;
	onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
	const quillRef = useRef<ReactQuill>(null);
	const [uploading, setUploading] = useState(false);

	const { uploadImage } = useBlogManagement();

	const [editorId] = useState(
		() => `editor-${Math.random().toString(36).substring(2, 9)}`
	);

	const imageHandler = useCallback(() => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			if (input.files && input.files[0]) {
				try {
					setUploading(true);

					const quill = quillRef.current?.getEditor();
					if (!quill) throw new Error("Quill editor not found.");

					for (const file of input.files) {
						const imageUrl = await uploadImage(file);
						const range = quill.getSelection() || {
							index: quill.getLength(),
							length: 0,
						};

						// Insert image at current cursor position
						quill.insertEmbed(range.index, "image", imageUrl);

						// Move cursor after the image
						quill.setSelection(range.index + 1, 0);

						// Important: Manually trigger a change event
						// This ensures the onChange callback is called with the updated content
						const currentContent = quill.root.innerHTML;
						onChange(currentContent);
					}

					quill.focus();
					setUploading(false);
				} catch (error) {
					console.error("Error handling image:", error);
					setUploading(false);
				}
			}
		};
	}, [uploadImage, onChange]);

	const formats = useMemo(
		() => [
			"header",
			"bold",
			"italic",
			"underline",
			"strike",
			"blockquote",
			"list",
			"bullet",
			"indent",
			"link",
			"image",
			"video",
			"code-block",
			"color",
			"background",
			"align",
		],
		[]
	);

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					["bold", "italic", "underline", "strike", "blockquote"],
					[
						{ list: "ordered" },
						{ list: "bullet" },
						{ indent: "-1" },
						{ indent: "+1" },
					],
					["link", "image", "video"],
					["code-block"],
					[{ color: [] }, { background: [] }],
					[{ align: [] }],
					["clean"],
				],
				handlers: {
					image: imageHandler,
				},
			},
			clipboard: {
				matchVisual: false,
			},
		}),
		[imageHandler]
	);

	// Use a memo to prevent unnecessary re-renders
	const handleChange = useCallback(
		(content: string) => {
			onChange(content);
		},
		[onChange]
	);

	return (
		<div className="rich-editor">
			{uploading && (
				<div className="rich-editor__uploading-indicator">
					Uploading image...
				</div>
			)}
			<div className="rich-editor__container">
				<ReactQuill
					key={editorId}
					ref={quillRef}
					theme="snow"
					value={value}
					onChange={handleChange}
					modules={modules}
					formats={formats}
					placeholder="Write your blog content here..."
				/>
			</div>
		</div>
	);
};

export default React.memo(RichTextEditor);
