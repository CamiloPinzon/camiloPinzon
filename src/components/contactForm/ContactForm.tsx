import { useState } from "react";

import Button from "../button/Button";
import Modal from "../modal/Modal";

import { createContactDocument } from "../../utils/firebase/creation";

import "./contactForm.scss";

const defaultFormFields = {
	fullName: "",
	email: "",
	company: "",
	phone: "",
	message: "",
};

const ContactForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { fullName, email, company, phone, message } = formFields;
	const [loaderModal, setLoaderModal] = useState<boolean>(false);
	const [isOpenMessageModal, setIsOpenMessageModal] = useState<boolean>(false);

	const clearFormFields = () => setFormFields(defaultFormFields);

	const handleOnChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoaderModal(true);
		try {
			await createContactDocument(formFields).finally(() => {
				setLoaderModal(false);
				if (!loaderModal) setIsOpenMessageModal(true);
				clearFormFields();
			});
		} catch (error) {
			console.error("Failed to submit contact:", error);
		}
	};

	return (
		<div className="contact-form">
			<Modal
				isOpen={loaderModal}
				onClose={() => setLoaderModal(false)}
				type="loader"
			/>
			<Modal
				isOpen={isOpenMessageModal}
				onClose={() => setIsOpenMessageModal(false)}
				type="success"
				title="Message Sent"
				children="Thank you for your message, we will get back to you as soon as possible."
			/>
			<form className="contact-form__form" onSubmit={handleOnSubmit}>
				<div className="contact-form__form-row">
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						value={fullName}
						onChange={handleOnChange}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div className="contact-form__form-row">
					<input
						type="text"
						name="company"
						placeholder="Company Name"
						value={company}
						onChange={handleOnChange}
					/>
					<input
						type="text"
						name="phone"
						placeholder="Phone Number"
						value={phone}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div className="contact-form__form-row">
					<textarea
						name="message"
						id="messageField"
						placeholder="Message"
						rows={10}
						value={message}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div className="contact-form__form-row submit-container">
					<Button type="submit" style="primary">
						Send
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ContactForm;
