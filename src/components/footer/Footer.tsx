import useResponsive from "../../hooks/useResponsive";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import SocialIcons from "../socialIcons/socialIcons";
import LegalFooter from "../legalFooter/LegarFooter";
import MenuFooter from "../menuFooter/MenuFooter";
import SuscribeForm from "../suscribeForm/SuscribeForm";

import "./footer.scss";

const Footer = () => {
	const { t } = useTranslation(NAMESPACES.COMMON);
	const { current } = useResponsive();
	const isMobile = current === "xs" || current === "sm" || current === "md";
	return (
		<div className="footer">
			<div className={`footer__up ${isMobile && "footer__up-mobile"}`}>
				<div className="footer__up-left">
					<h3>CAMILO PINZÓN</h3>
					<i>Web Developer</i>
					<SocialIcons />
				</div>
				<div className="footer__up-center">
					<MenuFooter />
				</div>
				<div className="footer__up-right">
					<h3>{t("common:susbribe-title")}</h3>
					<i>{t("common:susbribe-description")}</i>
					<SuscribeForm />
				</div>
			</div>
			<div className="footer__down">
				<LegalFooter />
			</div>
		</div>
	);
};

export default Footer;
