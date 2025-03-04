import { Link } from "react-router-dom";

import "./legalFooter.scss";

const LegalFooter = () => {
	//get year
	const year = new Date().getFullYear();
	return (
		<div className="legal">
			<p>
				© Copyright © {year} Design And Developed By Camilo Pinzón. All Rights
				Reserved.
				<br />
				<span>
					<Link to="/">Terms and conditions</Link>
					&nbsp;&nbsp;&#183;&nbsp;&nbsp;
					<Link to="/">Cookies policy</Link>
				</span>
			</p>
			<p className="recaptcha-terms">
				This site is protected by reCAPTCHA v3.{" "}
				<a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
				<a href="https://policies.google.com/terms">Terms of Service</a> apply.
			</p>
		</div>
	);
};

export default LegalFooter;
