import SocialIcons from "../socialIcons/socialIcons";
import LegalFooter from "../legalFooter/LegarFooter";
import MenuFooter from "../menuFooter/MenuFooter";
import SuscribeForm from "../suscribeForm/SuscribeForm";

import "./footer.scss";

const Footer = () => {
	return (
		<div className="footer">
			<div className="footer__up">
				<div className="footer__up-left">
					<h3>CAMILO PINZÓN</h3>
					<i>Web Developer</i>
					<SocialIcons />
				</div>
				<div className="footer__up-center">
					<MenuFooter />
				</div>
				<div className="footer__up-right">
					<h3>Suscribe for updates</h3>
					<i>Stay updated with the latest blogs.</i>
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
