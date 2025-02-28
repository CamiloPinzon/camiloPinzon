import { ReactNode, useEffect } from "react";
import Spinner from "../spinner/Spinner";
import "./modal.scss";

type ModalType = "default" | "loader" | "message" | "error" | "success";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children?: ReactNode;
	type?: ModalType;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	type = "default",
}) => {
	useEffect(() => {
		console.log(`🚀 Modal - isOpen: ${isOpen}`);
	}, [isOpen]);

	if (!isOpen) return null;
	const showCloseButton = type !== "loader";
	const showTitle = type !== "message";
	const getHeaderClass = (): string => {
		switch (type) {
			case "error":
				return "modal__header--error";
			case "success":
				return "modal__header--success";
			default:
				return "modal__header--default";
		}
	};

	return (
		<div className="modal-overlay">
			<div className="modal">
				{showTitle && title && (
					<div className={`modal__header ${getHeaderClass()}`}>
						<h3 className="modal__title">{title}</h3>
						{showCloseButton && (
							<button
								onClick={onClose}
								className="modal__close"
								aria-label="Close"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						)}
					</div>
				)}
				<div className="modal__content">
					{type === "loader" ? (
						<div className="modal__loader">
							<Spinner />
							{children && <div className="modal__loader-text">{children}</div>}
						</div>
					) : (
						<div>
							{children}
							{type === "message" && showCloseButton && (
								<div className="modal__footer">
									<button onClick={onClose} className="modal__button">
										Close
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
