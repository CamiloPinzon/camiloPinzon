import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import useResponsive from "../../hooks/useResponsive";
import Hero from "../../components/hero/Hero";
import Tags from "../../components/tags/Tags";
import Card from "../../components/card/Card";
import "./experience.scss";
import { SupportedLanguage } from "../../i18n/languageOptions";

interface ExperienceItem {
	id: number;
	company: string;
	position: string;
	dateStart: string;
	dateEnd: string;
	description: string;
	technologies: string[];
	link?: string;
}

interface ExperienceData {
	experienceContent: ExperienceItem[];
}

const Experience = () => {
	const [experienceContent, setExperienceContent] = useState<ExperienceItem[]>(
		[]
	);
	const { t } = useTranslation(NAMESPACES.COMMON);
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language as SupportedLanguage;

	useEffect(() => {
		try {
			const fetchExperience = async () => {
				const response = await fetch(
					`./data/experience_${currentLanguage}.json`
				);
				const data: ExperienceData = await response.json();

				if (!data.experienceContent || !Array.isArray(data.experienceContent)) {
					console.error("Invalid data format:", data);
					return;
				}

				setExperienceContent(data.experienceContent);
			};

			fetchExperience();
		} catch (error) {
			console.error("Error fetching experience data:", error);
		}
	}, [currentLanguage]);

	const content = [...experienceContent].reverse();
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm";
	return (
		<section className="experience-container">
			<title>{t("experience:title")}</title>
			<meta name="description" content={t("experience:text")} />
			<div className="experience-hero">
				<Hero
					bgImage="./images/experienceHero.webp"
					title={t("experience:title")}
					paragraph={t("experience:text")}
					style="light"
				/>
			</div>
			<main className="experience-list container">
				{content.map((item: ExperienceItem) => {
					const ExperienceContent = () => (
						<div className={`experience-item-content ${isMobile && "column"}`}>
							<div className="experience-item-content__left">
								<p>
									{item.dateStart} - {item.dateEnd}
								</p>
							</div>
							<div className="experience-item-content__right">
								<h2>{item.company}</h2>
								<p>{item.position}</p>
								<p dangerouslySetInnerHTML={{ __html: item.description }}></p>
								<div className="technologies">
									<Tags tags={item.technologies} />
								</div>
							</div>
						</div>
					);

					return (
						<article key={item.id} className="experience-item">
							{item.link ? (
								<Link
									to={item.link}
									target="_blank"
									className="experience-item__link"
								>
									<Card>
										<ExperienceContent />
									</Card>
								</Link>
							) : (
								<Card>
									<ExperienceContent />
								</Card>
							)}
						</article>
					);
				})}
			</main>
		</section>
	);
};

export default Experience;
