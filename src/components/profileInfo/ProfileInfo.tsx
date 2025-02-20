import { useNavigate } from "react-router-dom";

import Image from "../image/Image";
import Button from "../button/Button";

import ProfilePic from "../../assets/profile_pic__sm.jpg";
import emailIcon from "../../assets/email.svg";
import phoneIcon from "../../assets/phone.svg";

import "./profileInfo.scss";

const ProfileInfo = () => {
	const navigate = useNavigate();

	const navigateToContact = () => {
		navigate("/contact");
	};
	return (
		<div className="profile-info">
			<div className="profile-info__image">
				<Image src={ProfilePic} alt="profile picture" kind="profile_rounded" />
			</div>
			<div className="profile-info__content">
				<h1>Camilo Pinzón</h1>
				<p>
					<i>Web Develper</i>
				</p>
				<br />
				<p>
					<h2>INTRODUCTION</h2>
					<p>
						Self-taught and dedicated. A web developer with ability to
						assimilate work under pressure and great facility for teamwork, no
						matter if it’s locally or remote. He brings his experience to find
						solutions for all the possible problems that can happen in all the
						project stages and brings calm to the customer.
					</p>
				</p>
				<br />
				<p>
					<h2>CONTACT</h2>
				</p>
				<ul className="profile-info__content-contact">
					<li>
						<Image src={emailIcon} alt="Email Icon" kind="icon" />
						<a href="mailto:pinzonac@gmail.com">pinzonac@gmail.com</a>
					</li>
					<li>
						<Image src={phoneIcon} alt="Phone Icon" kind="icon" />
						<a href="tel:+57 317 664 4185">57 317 664 4185</a>
					</li>
				</ul>
				<Button onClick={navigateToContact} type="button" style="primary">
					Contact
				</Button>
			</div>
		</div>
	);
};

export default ProfileInfo;
