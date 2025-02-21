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
		</div>
	);
};

export default LegalFooter;
