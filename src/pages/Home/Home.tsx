import { useState } from "react";

import useResponsive from "../../hooks/useResponsive";
import { useSEO } from "../../hooks/useSEO";

import Image from "../../components/image/Image";
import LatestBlogs from "../../components/latestBlogs/LatestBlogs";

import heroImage from "../../assets/home_hero_desktop.jpg";
import ProfileInfo from "../../components/profileInfo/ProfileInfo";
import TabedNavigation from "../../components/tabedNavigation/TabedNavigation";
import FeaturedRepos from "../../components/featuredRepos/FeaturedRepos";
import Modal from "../../components/modal/Modal";

import "./home.scss";

const Home = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"Freelance front-end developer specializing in React, WordPress & TypeScript. I create fast, modern, and user-friendly websites. Let’s build something great!",
		image:
			"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
	});

	const [isOpenMessageModal, setIsOpenMessageModal] = useState(true);
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm";
	return (
		<div className="home">
			<Modal
				isOpen={isOpenMessageModal}
				onClose={() => setIsOpenMessageModal(false)}
				type="default"
				title="Under construction"
				children="This site is under construction."
			/>
			<div className="home__hero">
				<Image src={heroImage} alt="hero image" kind="full_hero" />
			</div>
			<div
				className={`home__profile ${
					isMobile && "home__profile--mobile"
				} container`}
			>
				<aside className="home__profile-info">
					<ProfileInfo />
				</aside>
				<div className="home__profile-misc">
					<TabedNavigation />
				</div>
			</div>
			<div className="home__blogs container">
				<LatestBlogs />
			</div>
			<div className="home__featured-repos">
				<div className="container">
					<FeaturedRepos />
				</div>
			</div>
		</div>
	);
};

export default Home;
