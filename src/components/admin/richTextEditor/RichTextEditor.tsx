// src/components/RichTextEditor.tsx
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { useBlogManagement } from "../../../hooks/useBlogManagement";

interface RichTextEditorProps {
	value: string;
	onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
	const { uploadImage } = useBlogManagement();
	const quillRef = useRef<ReactQuill>(null);
	const [uploading, setUploading] = useState(false);

	const imageHandler = () => {
		setUploading(true);

		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			if (input.files && input.files[0]) {
				try {
					const file = input.files[0];

					const imageUrl = await uploadImage(file);

					const quill = quillRef.current?.getEditor();
					if (quill) {
						const range = quill.getSelection(true);
						quill.insertEmbed(range.index, "image", imageUrl);
					}
				} catch (error) {
					console.error("Error uploading image:", error);
				} finally {
					setUploading(false);
				}
			}
		};
	};

	const formats = [
		"header",
		"font",
		"size",
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
		"table",
	];

	const modules = {
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
	};

	return (
		<div className="rich-text-editor">
			{uploading && (
				<div className="uploading-indicator">Uploading image...</div>
			)}
			<ReactQuill
				ref={quillRef}
				theme="snow"
				value={value}
				onChange={onChange}
				modules={modules}
				formats={formats}
				placeholder="Write your blog content here..."
			/>
		</div>
	);
};

export default RichTextEditor;
