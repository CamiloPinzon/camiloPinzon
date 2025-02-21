import { Link } from "react-router-dom";

import Image from "../image/Image";

import linkedIn from "../../assets/linkedIn.svg";
import gitHub from "../../assets/github.svg";
import leetCode from "../../assets/leetcode.svg";

import "./footer.scss";

const Footer = () => {
	return (
		<div className="footer">
			<div className="footer__up">
				<div className="footer__up-left">
					<h3>CAMILO PINZÓN</h3>
					<i>Web Developer</i>
					<div className="footer__up-left--social">
						<Link
							to={`https://www.linkedin.com/in/camilo-pinzon/`}
							target="_blank"
						>
							<Image src={linkedIn} alt="LinkedIn" kind="icon" />
						</Link>
					</div>
				</div>
				<div className="footer__up-center">
					<div>Footer menú</div>
				</div>
			</div>
			<div className="footer__down">
				<div>Legal Menú</div>
			</div>
		</div>
	);
};

export default Footer;
