import useResponsive from "../../hooks/useResponsive";

import Image from "../../components/image/Image";
import LatestBlogs from "../../components/latestBlogs/LatestBlogs";
import Clientes from "../../components/clientes/Clientes";
import ProfileInfo from "../../components/profileInfo/ProfileInfo";
import TabedNavigation from "../../components/tabedNavigation/TabedNavigation";

import "./home.scss";

const Home = () => {
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm";
	return (
		<div className="home">
			<div className="home__hero">
				<Image
					src="./images/home_hero_desktop.webp"
					alt="hero image"
					kind="full_hero"
				/>
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
			<div className="home__clientes container">
				<Clientes />
			</div>
		</div>
	);
};

export default Home;
