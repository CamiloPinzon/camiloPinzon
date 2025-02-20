import Image from "../../components/image/Image";

import heroImage from "../../assets/home_hero_desktop.jpg";
import ProfileInfo from "../../components/profileInfo/ProfileInfo";
import TabedNavigation from "../../components/tabedNavigation/TabedNavigation";

import "./home.scss";

const Home = () => {
	return (
		<div className="home">
			<div className="home__hero">
				<Image src={heroImage} alt="hero image" kind="full_hero" />
			</div>
			<div className="home__profile">
				<aside className="home__profile-info">
					<ProfileInfo />
				</aside>
				<div className="home__profile-misc">
					<TabedNavigation />
				</div>
			</div>
		</div>
	);
};

export default Home;
