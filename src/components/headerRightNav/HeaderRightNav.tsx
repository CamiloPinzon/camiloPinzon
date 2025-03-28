import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from "../button/Button";
import Image from "../image/Image";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";

import "./headerRightNav.scss";

const HeaderRightNav = () => {
	const navigate = useNavigate();

	const { t } = useTranslation(NAMESPACES.COMMON);

	const handleContactClick = () => {
		navigate("/contact");
	};
	return (
		<div className="header-right-nav">
			<Button onClick={handleContactClick} type="button" style="primary">
				{t("common:contact")}
			</Button>
			<LanguageSwitcher variant="toggle" />
			<Link to="/">
				<Image
					src="/images/profile.webp"
					alt="profile picture"
					kind="small_rounded"
				/>
			</Link>
		</div>
	);
};

export default HeaderRightNav;
