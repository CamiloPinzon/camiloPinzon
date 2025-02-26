import { useState, useEffect } from "react";

import Button from "../button/Button";

import "./contactForm.scss";

const defaultFormFields = {
	fullName: "",
	email: "",
	company: "",
	phone: "",
	message: "",
};

declare global {
	interface Window {
		grecaptcha: unknown;
	}
}

const ContactForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { fullName, email, company, phone, message } = formFields;

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://www.google.com/recaptcha/api.js";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleSubmit = (token: string) => {
		console.log("reCAPTCHA Token:", token);
		const form = document.getElementById("contact-form") as HTMLFormElement;
		if (form) form.submit();
	};

	const handleOnChange = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	return (
		<div className="contact-form">
			<form
				className="contact-form__form"
				id="contact-form"
				action="/submit"
				method="POST"
			>
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
					<Button type="submit" style="primary" isReacptcha={true}>
						Send
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ContactForm;
