import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import "./menuFooter.scss";

const MenuFooter = () => {
	const { t } = useTranslation(NAMESPACES.COMMON);
	return (
		<div className="menu-footer">
			<Link to="/">{t("common:home")}</Link>
			<Link to="/experience">{t("common:experience")}</Link>
			<Link to="/services">{t("common:services")}</Link>
			<Link to="/blogs">{t("common:blogs")}</Link>
			<Link to="/contact">{t("common:contact")}</Link>
		</div>
	);
};

export default MenuFooter;
