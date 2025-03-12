import React, { useRef, useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
	value: string;
	onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
	const quillRef = useRef<ReactQuill>(null);
	const [uploading, setUploading] = useState(false);

	// Generate a stable ID for the editor instance
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
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const file = input.files[0];

					// Here you would normally call your uploadImage function
					// For now we're just simulating the flow
					setTimeout(() => {
						const quill = quillRef.current?.getEditor();
						if (quill) {
							// Get current selection or default to end
							const range = quill.getSelection() || {
								index: quill.getLength(),
								length: 0,
							};

							// For demo purposes - in real app replace with actual URL from your upload
							const dummyUrl = "https://via.placeholder.com/300";

							// Insert image
							quill.insertEmbed(range.index, "image", dummyUrl);

							// Move cursor after the image
							quill.setSelection(range.index + 1, 0);

							// Ensure editor has focus
							quill.focus();
							setUploading(false);
						}
					}, 1000);
				} catch (error) {
					console.error("Error handling image:", error);
					setUploading(false);
				}
			}
		};
	}, []);

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
