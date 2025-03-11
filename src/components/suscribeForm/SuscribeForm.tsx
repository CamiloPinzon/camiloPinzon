import { useState } from "react";
import { useRecaptcha } from "../../hooks/useRecaptcha";
import { FirebaseError } from "firebase/app";

import Button from "../button/Button";
import Input from "../Input/Input";
import Modal from "../modal/Modal";

import { createUserNewsletterDocument } from "../../utils/firebase/creation";

import "./susbribeForm.scss";

const defaultFormFields = {
	email: "",
	honeypot: "",
};

const successTexts = {
	title: "You’re In! 🎉",
	text: "Thanks for subscribing! Great content is on its way to your inbox.",
};

const defaultErrorTexts = {
	title: "Something went wrong",
	text: "Please try again later.",
};

const SuscribeForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { email, honeypot } = formFields;
	const [loaderModal, setLoaderModal] = useState<boolean>(false);
	const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
	const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
	const [errorTexts, setErrorTexts] = useState(defaultErrorTexts);
	const { executeRecaptcha, loading } = useRecaptcha();

	const clearFormFields = () => setFormFields(defaultFormFields);
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (honeypot) return;
		e.preventDefault();
		setLoaderModal(true);

		if (loading) {
			setErrorTexts({ ...defaultErrorTexts, text: "reCAPTCHA not yet loaded" });
			setIsOpenErrorModal(true);
			setLoaderModal(false);
			return;
		}

		try {
			const token = await executeRecaptcha("submit_form");

			if (!token) {
				setErrorTexts({
					...defaultErrorTexts,
					text: "Failed to get reCAPTCHA token",
				});
				setIsOpenErrorModal(true);
				setLoaderModal(false);
				return;
			}

			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error("Operation timed out after 5 seconds"));
				}, 5000);
			});

			// Wait for the result of the createUserNewsletterDocument function
			const result = (await Promise.race([
				createUserNewsletterDocument({ email }),
				timeoutPromise,
			])) as { success: boolean; message: string };

			setLoaderModal(false);

			// Check if subscription was successful
			if (result.success) {
				setIsOpenSuccessModal(true);
				clearFormFields();
			} else {
				// Handle application-level error (like duplicate email)
				setErrorTexts({ ...defaultErrorTexts, text: result.message });
				setIsOpenErrorModal(true);
			}
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
				console.error("Newsletter signup error:", error);
			}
		}
	};

	return (
		<>
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
			<form onSubmit={handleOnSubmit}>
				<Input
					type="email"
					name="email"
					placeholder="your@email.com"
					style="light"
					value={email}
					onChange={handleOnChange}
					required
				/>
				<Input
					type="text"
					name="honeypot"
					placeholder="honeypot"
					style="honeypot"
					value={honeypot}
					onChange={handleOnChange}
					required={false}
				/>
				<Button type="submit" style="primary">
					Suscribe
				</Button>
			</form>
		</>
	);
};

export default SuscribeForm;
