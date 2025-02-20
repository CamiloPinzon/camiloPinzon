import { useNavigate } from "react-router-dom";

import Button from "../button/Button";
import Image from "../image/Image";

import ProfilePic from "../../assets/profile-pic__xs.jpg";

import "./headerRightNav.scss";

const HeaderRightNav = () => {
	const navigate = useNavigate();

	const handleContactClick = () => {
		navigate("/contact");
	};
	return (
		<div className="header-right-nav">
			<Button onClick={handleContactClick} type="button" style="primary">
				Contact
			</Button>
			<Image src={ProfilePic} alt="profile picture" kind="small_rounded" />
		</div>
	);
};

export default HeaderRightNav;
