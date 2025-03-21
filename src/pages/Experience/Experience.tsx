import { Link } from "react-router-dom";

import { useSEO } from "../../hooks/useSEO";
import useResponsive from "../../hooks/useResponsive";
import Hero from "../../components/hero/Hero";
import Tags from "../../components/tags/Tags";
import Card from "../../components/card/Card";
import { experienceContent } from "../../data/experience.json";
import "./experience.scss";

interface ExperienceDataI {
	id: number;
	company: string;
	position: string;
	dateStart: string;
	dateEnd: string;
	description: string;
	technologies: string[];
	link?: string;
}

const Experience = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"Explore my experience as a front-end developer specializing in React, WordPress, WooCommerce, and modern web solutions. See how I can help your project.",
	});

	const content = experienceContent.reverse();
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm";

	const paragraph =
		"Experienced web developer crafting high-quality, scalable, and efficient digital solutions.";
	return (
		<section className="experience-container">
			<div className="experience-hero">
				<Hero
					bgImage="./images/experienceHero.jpg"
					title="Bringing Ideas to Life with Code"
					paragraph={paragraph}
					style="light"
				/>
			</div>
			<main className="experience-list container">
				{content.map((item: ExperienceDataI) => {
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
