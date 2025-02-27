import { useState } from "react";

import Button from "../button/Button";

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
		try {
			const contactRef = await createContactDocument(formFields);
			console.log("Contact created with ID:", contactRef.id);
		} catch (error) {
			console.error("Failed to submit contact:", error);
		}
	};

	return (
		<div className="contact-form">
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
