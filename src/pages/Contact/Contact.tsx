import Hero from "../../components/hero/Hero";
import Button from "../../components/button/Button";
import Image from "../../components/image/Image";
import ContactForm from "../../components/contactForm/ContactForm";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import useResponsive from "../../hooks/useResponsive";

import emailIcon from "../../assets/email.svg";
import phoneIcon from "../../assets/phone.svg";

import "./contact.scss";

const Contact = () => {
	const { t } = useTranslation(NAMESPACES.CONTACT);

	const { current, isXs } = useResponsive();
	const isMobile = current === "xs" || current === "sm";

	const handleEmailLink = () => {
		window.location.href = "mailto:camilopinzondeveloper@gmail.com";
	};

	const handlePhoneLink = () => {
		window.location.href = "tel:123-456-7890";
	};
	return (
		<div className="contact">
			<title>{t("contact:hero_title")}</title>
			<meta name="description" content={t("contact:hero_text")} />
			<Hero
				bgImage="./images/contactHero.webp"
				title={t("contact:hero_title")}
				paragraph={t("contact:hero_text")}
				style="light"
			/>
			<main className="contact-main container">
				<h2>{t("contact:title")}</h2>
				<div className={`contact-main__contact-links ${isMobile && "column"}`}>
					<Button onClick={handleEmailLink} type="button" style="secondary">
						<Image src={emailIcon} alt="email icon" kind="light_icon" />
						{isXs ? "Send me an email" : "camilopinzondeveloper@gmail.com"}
					</Button>
					<Button onClick={handlePhoneLink} type="button" style="secondary">
						<Image src={phoneIcon} alt="phone icon" kind="light_icon" />
						+57 317 664 4185
					</Button>
				</div>
				<div className="contact-main__contact-form">
					<h3>{t("contact:form_title")}</h3>
					<ContactForm />
				</div>
			</main>
		</div>
	);
};

export default Contact;
