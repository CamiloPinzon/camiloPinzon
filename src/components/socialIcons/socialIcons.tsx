import { Link } from "react-router-dom";
import Image from "../image/Image";

import linkedIn from "../../assets/linkedIn.svg";
import gitHub from "../../assets/github.svg";
import leetCode from "../../assets/leetcode.svg";
import instagram from "../../assets/instagram.svg";
import x from "../../assets/x.svg";

import "./socialIcons.scss";

const SocialIcons = () => {
	const LinkedInUrl = "https://www.linkedin.com/in/camilo-pinzon/";
	const GitHubUrl = "https://github.com/CamiloPinzon";
	const LeetCodeUrl = "https://leetcode.com/u/pinzonac/";
	const InstagramURL = "https://www.instagram.com/camilopinzon_developer";
	const XUrl = "https://x.com/CamiloPinzonDev";

	return (
		<div className="social-icons">
			<Link to={LinkedInUrl} target="_blank">
				<Image src={linkedIn} alt="LinkedIn" kind="icon" />
			</Link>
			<Link to={GitHubUrl} target="_blank">
				<Image src={gitHub} alt="Github" kind="icon" />
			</Link>
			<Link to={LeetCodeUrl} target="_blank">
				<Image src={leetCode} alt="LeetCode" kind="icon" />
			</Link>
			<Link to={InstagramURL} target="_blank">
				<Image src={instagram} alt="Instagram" kind="icon" />
			</Link>
			<Link to={XUrl} target="_blank">
				<Image src={x} alt="X" kind="icon" />
			</Link>
		</div>
	);
};

export default SocialIcons;
