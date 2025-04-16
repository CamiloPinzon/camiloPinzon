import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import Hero from "../../components/hero/Hero";
import Image from "../../components/image/Image";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";

import "./services.scss";
import { SupportedLanguage } from "../../i18n/languageOptions";

export interface ServiceItem {
	title: string;
	image: string;
	subtitle: string;
	description: string;
	includedItems: string[];
	ctaText: string;
}

export interface ServicesData {
	services: ServiceItem[];
}

const Services = () => {
	const [servicesData, setServicesData] = useState<ServicesData | null>(null);

	const { t } = useTranslation(NAMESPACES.SERVICES);
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language as SupportedLanguage;

	useEffect(() => {
		try {
			const getServicesData = async () => {
				const response = await fetch(`./data/services_${currentLanguage}.json`);
				const data = await response.json();
				setServicesData(data);
			};

			getServicesData();
		} catch (error) {
			console.error("Error fetching services data:", error);
		}
	}, [currentLanguage]);

	const navigation = useNavigate();

	const handleContactClick = () => {
		navigation("/contact");
	};
	return (
		<div className="services-container">
			<title>{t("services:title")}</title>
			<meta name="description" content={t("services:text")} />
			<Hero
				bgImage="./images/servicesHero.webp"
				title={t("services:title")}
				paragraph={t("services:text")}
				style="light"
			/>
			<main className="services-list container">
				{servicesData?.services.map((service, idx) => (
					<Card key={idx}>
						<div className="services-item">
							<Image src={service.image} alt={service.title} kind="medium" />
							<h2 className="services-item__title">{service.title}</h2>
							<i className="services-item__subtitle">{service.subtitle}</i>
							<p className="services-item__description">
								{service.description}
							</p>
							<p className="services-item__list-title">What’s Included:</p>
							<ul className="services-item__list">
								{service.includedItems.map((item, idx) => (
									<li key={idx}>{item}</li>
								))}
							</ul>
							<p className="services-item__cta">
								{service.ctaText}
								<Button
									type="button"
									style="primary"
									onClick={handleContactClick}
								>
									{t("services:cta_button_text")}
								</Button>
							</p>
						</div>
					</Card>
				))}
			</main>
			<section className="services-cta container">
				<h2>{t("services:cta_title")}</h2>
				<p>{t("services:cta_text")}</p>
				<div className="services-cta__button">
					<Button type="button" style="primary" onClick={handleContactClick}>
						{t("services:cta_button_text")}
					</Button>
				</div>
			</section>
		</div>
	);
};

export default Services;
