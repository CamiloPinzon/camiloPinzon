import { useNavigate } from "react-router-dom";

import { useSEO } from "../../hooks/useSEO";

import Hero from "../../components/hero/Hero";
import Image from "../../components/image/Image";
import Button from "../../components/button/Button";
import Card from "../../components/card/Card";

import "./services.scss";

const Services = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"I offer front-end development services using React, WordPress & WooCommerce. Get a high-performance, user-friendly website tailored to your needs.",
	});

	const navigation = useNavigate();

	const handleContactClick = () => {
		navigation("/contact");
	};
	return (
		<div className="services-container">
			<Hero
				bgImage="./images/servicesHero.jpg"
				title="Services"
				paragraph="I offer a range of services to help you achieve your goals."
				style="light"
			/>
			<main className="services-list container">
				<Card>
					<div className="services-item">
						<Image
							src="./images/website_development.jpg"
							alt="Website Development"
							kind="medium"
						/>
						<h2>Website Development</h2>
						<p>
							From sleek WordPress sites to fully customized websites using
							React.js, I create high-performance websites that resonate with
							your brand and engage your audience. Whether you need a blog, a
							portfolio, or a business site, my development services ensure a
							responsive, SEO-optimized, and visually appealing website that
							drives traffic and conversions
						</p>
						<Button type="button" style="primary" onClick={handleContactClick}>
							Contact Me
						</Button>
					</div>
				</Card>
				<Card>
					<div className="services-item">
						<Image
							src="./images/ecommerce.jpg"
							alt="E-commerce Development"
							kind="medium"
						/>
						<h2>E-commerce Development</h2>
						<p>
							Boost your online sales with a powerful e-commerce platform that
							delivers a seamless shopping experience. I specialize in building
							e-commerce websites that are secure, scalable, and easy to manage.
							From product listings to payment gateways, every aspect is
							optimized to convert visitors into loyal customers.
						</p>
						<Button type="button" style="primary" onClick={handleContactClick}>
							Contact Me
						</Button>
					</div>
				</Card>
				<Card>
					<div className="services-item">
						<Image
							src="./images/Frontend.jpg"
							alt="Frontend React Development"
							kind="medium"
						/>
						<h2>Frontend React Development</h2>
						<p>
							Elevate your web presence with dynamic, fast-loading, and
							interactive user interfaces built with React.js. I bring your
							ideas to life with cutting-edge frontend development that
							prioritizes user experience, performance, and SEO. Whether it’s a
							single-page application or a complex web app, my React.js
							solutions are designed to engage users and boost your business.
						</p>
						<Button type="button" style="primary" onClick={handleContactClick}>
							Contact Me
						</Button>
					</div>
				</Card>
			</main>
			<section className="services-cta container">
				<h2>Bring Your Vision to Life with Expert Development</h2>
				<p>
					Let’s build something amazing together! Get in touch today to discuss
					your project and turn your ideas into reality.
				</p>
				<div className="services-cta__button">
					<Button type="button" style="primary" onClick={handleContactClick}>
						Contact Me
					</Button>
				</div>
			</section>
		</div>
	);
};

export default Services;
