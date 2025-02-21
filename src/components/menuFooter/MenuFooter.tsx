import { Link } from "react-router-dom";

import "./menuFooter.scss";

const MenuFooter = () => {
	return (
		<div className="menu-footer">
			<Link to="/">Home</Link>
			<Link to="/experience">Experience</Link>
			<Link to="/services">Services</Link>
			<Link to="/blogs">Blogs</Link>
		</div>
	);
};

export default MenuFooter;
