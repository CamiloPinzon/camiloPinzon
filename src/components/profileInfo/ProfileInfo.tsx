import { useNavigate } from "react-router-dom";

import Image from "../image/Image";
import Button from "../button/Button";
import SocialIcons from "../socialIcons/socialIcons";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import emailIcon from "../../assets/email.svg";
import phoneIcon from "../../assets/phone.svg";

import "./profileInfo.scss";

const ProfileInfo = () => {
	const { t } = useTranslation(NAMESPACES.PROFILE_INFO);
	const navigate = useNavigate();
	const navigateToContact = () => {
		navigate("/contact");
	};
	return (
		<div className="profile-info">
			<div className="profile-info__image">
				<Image
					src="/images/profile.webp"
					alt="profile picture"
					kind="profile_rounded"
				/>
			</div>
			<div className="profile-info__content">
				<h1>Camilo Pinzón</h1>
				<p>
					<i>Web Developer</i>
				</p>
				<div className="profile-info__content-social">
					<SocialIcons />
				</div>
				<br />
				<h2>{t("profileInfo:about_title")}</h2>
				<p>{t("profileInfo:introduction")}</p>
				<br />
				<h2>{t("profileInfo:contact_title")}</h2>
				<ul className="profile-info__content-contact">
					<li>
						<Image src={emailIcon} alt="Email Icon" kind="icon" />
						<a href="mailto:camilopinzondeveloper@gmail.com">
							{t("profileInfo:send_email")}
						</a>
					</li>
					<li>
						<Image src={phoneIcon} alt="Phone Icon" kind="icon" />
						<a href="tel:+57 317 664 4185">57 317 664 4185</a>
					</li>
				</ul>
				<Button onClick={navigateToContact} type="button" style="primary">
					{t("profileInfo:contact_button")}
				</Button>
			</div>
		</div>
	);
};

export default ProfileInfo;
