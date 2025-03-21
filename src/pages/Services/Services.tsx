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
						<h2 className="services-item__title">Website Development</h2>
						<i className="services-item__subtitle">
							Modern, Fast & Optimized Websites
						</i>
						<p className="services-item__description">
							Your website is your digital storefront—it should be fast,
							engaging, and optimized for success. I build custom,
							high-performance websites using WordPress and modern front-end
							technologies, ensuring a seamless experience for your users.
						</p>
						<p className="services-item__list-title">What’s Included:</p>
						<ul className="services-item__list">
							<li>
								Custom Design & Development – Tailored to your brand and
								audience.
							</li>
							<li>SEO Optimization – Better visibility on search engines.</li>
							<li>Mobile-Responsive Design – Perfect on all devices.</li>
							<li>
								Performance & Security – Speed and protection for a reliable
								site.
							</li>
							<li>Scalability – Built to grow with your business.</li>
						</ul>
						<p className="services-item__cta">
							Let’s create a website that stands out and drives results. Get in
							touch today!
							<Button
								type="button"
								style="primary"
								onClick={handleContactClick}
							>
								Contact Me
							</Button>
						</p>
					</div>
				</Card>
				<Card>
					<div className="services-item">
						<Image
							src="./images/ecommerce.jpg"
							alt="E-commerce Development"
							kind="medium"
						/>
						<h2 className="services-item__title">E-Commerce Development</h2>
						<i className="services-item__subtitle">
							Sell Online with a Powerful Store
						</i>
						<p className="services-item__description">
							A well-built online store can boost your sales and improve
							customer experience. I develop high-performing e-commerce websites
							using WooCommerce, ensuring your store is fast, secure, and easy
							to manage.
						</p>
						<p className="services-item__list-title">What’s Included:</p>
						<ul className="services-item__list">
							<li>Custom Store Design – Beautiful, user-friendly layouts.</li>
							<li>
								Payment & Shipping Integration – Secure and seamless
								transactions.
							</li>
							<li>
								Product Management System – Easy to add, edit, and organize
								products.
							</li>
							<li>
								Mobile Optimization – A smooth shopping experience on any
								device.
							</li>
							<li>
								SEO & Speed Optimization – Better rankings and faster
								performance.
							</li>
						</ul>
						<p className="services-item__cta">
							Whether you’re starting a new store or upgrading an existing one,
							I’ll help you sell more with an optimized e-commerce platform.
							Let’s build your online store today!
							<Button
								type="button"
								style="primary"
								onClick={handleContactClick}
							>
								Contact Me
							</Button>
						</p>
					</div>
				</Card>
				<Card>
					<div className="services-item">
						<Image
							src="./images/Frontend.jpg"
							alt="Frontend React Development"
							kind="medium"
						/>
						<h2 className="services-item__title">Frontend React Development</h2>
						<i className="services-item__subtitle">
							Scalable & Modern Web Apps
						</i>
						<p className="services-item__description">
							Elevate your web presence with dynamic, fast-loading, and
							interactive user interfaces built with React.js. I bring your
							ideas to life with cutting-edge frontend development that
							prioritizes user experience, performance, and SEO. Whether it’s a
							single-page application or a complex web app, my React.js
							solutions are designed to engage users and boost your business.
						</p>
						<p className="services-item__list-title">What’s Included:</p>
						<ul className="services-item__list">
							<li>
								Custom React Development – Tailored components and UI for your
								needs.
							</li>
							<li>
								State Management (Redux, Context API) – Scalable and efficient
								apps.
							</li>
							<li>
								API Integrations – Connect your app with back-end services.
							</li>
							<li>
								Performance Optimization – Fast loading speeds and smooth
								interactions.
							</li>
							<li>
								Responsive & Accessible Design – Works perfectly on all devices.
							</li>
						</ul>
						<p className="services-item__cta">
							Let’s bring your web application to life with cutting-edge
							front-end technology. Start your project today!
							<Button
								type="button"
								style="primary"
								onClick={handleContactClick}
							>
								Contact Me
							</Button>
						</p>
					</div>
				</Card>
				<Card>
					<div className="services-item">
						<Image
							src="./images/webmaster.jpg"
							alt="Webmaster Service"
							kind="medium"
						/>
						<h2 className="services-item__title">Webmaster Service</h2>
						<i className="services-item__subtitle">
							Keep Your Website Running Smoothly
						</i>
						<p className="services-item__description">
							Your website is a crucial part of your business—don’t let
							technical issues slow you down. With my Webmaster Service, I
							ensure your site stays secure, updated, and performing at its
							best.
						</p>
						<p className="services-item__list-title">What’s Included:</p>
						<ul className="services-item__list">
							<li>
								Website Maintenance – Regular updates for WordPress, plugins,
								and themes.
							</li>
							<li>
								Security & Backups – Protect your site with security monitoring
								and scheduled backups.
							</li>
							<li>
								Performance Optimization – Improve loading speed and user
								experience.
							</li>
							<li>
								Content Updates – Need to change text, images, or add new pages?
								I’ve got you covered.
							</li>
							<li>
								Troubleshooting & Support – Quick fixes for bugs, errors, and
								technical issues.
							</li>
						</ul>
						<p className="services-item__cta">
							Let me handle the technical side so you can focus on growing your
							business. Get in touch today!
							<Button
								type="button"
								style="primary"
								onClick={handleContactClick}
							>
								Contact Me
							</Button>
						</p>
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
