import { useState } from "react";
import { FirebaseError } from "firebase/app";

import Button from "../button/Button";
import Modal from "../modal/Modal";
import { useRecaptcha } from "../../hooks/useRecaptcha";

import { createContactDocument } from "../../utils/firebase/creation";

import "./contactForm.scss";

const defaultFormFields = {
	fullName: "",
	email: "",
	company: "",
	phone: "",
	message: "",
};

const successTexts = {
	title: "Message Sent",
	text: "Thank you for your message, we will get back to you as soon as possible.",
};

const defaultErrorTexts = {
	title: "Something went wrong",
	text: "Please try again later.",
};

const ContactForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { fullName, email, company, phone, message } = formFields;
	const [loaderModal, setLoaderModal] = useState<boolean>(false);
	const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
	const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
	const [errorTexts, setErrorTexts] = useState(defaultErrorTexts);
	const { executeRecaptcha, loading } = useRecaptcha();

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

		if (loading) {
			setErrorTexts({ ...defaultErrorTexts, text: "reCAPTCHA not yet loaded" });
			setIsOpenErrorModal(true);
			return;
		}
		try {
			const token = await executeRecaptcha("submit_form");
			console.log(`token: ${token}`);

			if (!token) {
				setErrorTexts({
					...defaultErrorTexts,
					text: "Failed to get reCAPTCHA token",
				});
				setIsOpenErrorModal(true);
				return;
			}

			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error("Operation timed out after 5 seconds"));
				}, 5000);
			});

			await Promise.race([createContactDocument(formFields), timeoutPromise]);

			setLoaderModal(false);
			setIsOpenSuccessModal(true);
			clearFormFields();
		} catch (error: unknown) {
			setLoaderModal(false);
			if (
				error instanceof Error &&
				error.message === "Operation timed out after 5 seconds"
			) {
				console.error("The operation timed out");
				setErrorTexts({ ...defaultErrorTexts, text: "Operation timed out" });
				setIsOpenErrorModal(true);
			} else if (error instanceof FirebaseError) {
				setErrorTexts({ ...defaultErrorTexts, text: error.message });
				setIsOpenErrorModal(true);
			} else {
				setErrorTexts({
					...defaultErrorTexts,
					text: "An unexpected error occurred",
				});
				setIsOpenErrorModal(true);
			}
		} finally {
			clearFormFields();
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
				isOpen={isOpenSuccessModal}
				onClose={() => setIsOpenSuccessModal(false)}
				type="success"
				title={successTexts.title}
				children={successTexts.text}
			/>
			<Modal
				isOpen={isOpenErrorModal}
				onClose={() => setIsOpenErrorModal(false)}
				type="error"
				title={errorTexts.title}
				children={errorTexts.text}
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
				<div data-netlify-recaptcha="true"></div>
				<div className="contact-form__form-row submit-container">
					<Button type="submit" style="primary">
						Send
					</Button>
				</div>
				<p className="recaptcha-terms">
					This site is protected by reCAPTCHA v3.{" "}
					<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
					<a href="https://policies.google.com/terms">Terms of Service</a>{" "}
					apply.
				</p>
			</form>
		</div>
	);
};

export default ContactForm;
