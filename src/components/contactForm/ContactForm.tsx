import { useState } from "react";
import { FirebaseError } from "firebase/app";

import useResponsive from "../../hooks/useResponsive";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

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

const ContactForm = () => {
	const { t } = useTranslation(NAMESPACES.CONTACT_FORM);
	const successTexts = {
		title: t("contactForm:success_title"),
		text: t("contactForm:success_text"),
	};

	const defaultErrorTexts = {
		title: t("contactForm:error_title"),
		text: t("contactForm:error_text"),
	};
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm";
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
			setErrorTexts({
				...defaultErrorTexts,
				text: t("contactForm:error_loading"),
			});
			setIsOpenErrorModal(true);
			return;
		}
		try {
			const token = await executeRecaptcha("submit_form");

			if (!token) {
				setErrorTexts({
					...defaultErrorTexts,
					text: t("contactForm:error_token"),
				});
				setIsOpenErrorModal(true);
				return;
			}

			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error(t("contactForm:error_timeout")));
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
				error.message === t("contactForm:error_timeout")
			) {
				setErrorTexts({
					...defaultErrorTexts,
					text: t("contactForm:error_timeout"),
				});
				setIsOpenErrorModal(true);
			} else if (error instanceof FirebaseError) {
				setErrorTexts({ ...defaultErrorTexts, text: error.message });
				setIsOpenErrorModal(true);
			} else {
				setErrorTexts({
					...defaultErrorTexts,
					text: t("contactForm:error_unexpected"),
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
				<div className={`contact-form__form-row ${isMobile && "column"}`}>
					<input
						type="text"
						name="fullName"
						placeholder={t("contactForm:fullName")}
						value={fullName}
						onChange={handleOnChange}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder={t("contactForm:email")}
						value={email}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div className={`contact-form__form-row ${isMobile && "column"}`}>
					<input
						type="text"
						name="company"
						placeholder={t("contactForm:company")}
						value={company}
						onChange={handleOnChange}
					/>
					<input
						type="text"
						name="phone"
						placeholder={t("contactForm:phone")}
						value={phone}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div className={`contact-form__form-row ${isMobile && "column"}`}>
					<textarea
						name="message"
						id="messageField"
						placeholder={t("contactForm:message")}
						rows={10}
						value={message}
						onChange={handleOnChange}
						required
					/>
				</div>
				<div data-netlify-recaptcha="true"></div>
				<div className="contact-form__form-row submit-container">
					<Button type="submit" style="primary">
						{t("contactForm:submit")}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ContactForm;
