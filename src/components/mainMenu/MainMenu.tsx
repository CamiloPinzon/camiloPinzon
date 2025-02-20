import { useState } from "react";
import { NavLink } from "react-router-dom";

import "./mainMenu.scss";

const MainMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="main-menu">
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/"
			>
				Home
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/experience"
			>
				Experience
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/services"
			>
				Services
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/blogs"
			>
				Blogs
			</NavLink>
			<div
				className="main-menu__dropdown"
				onMouseEnter={toggleOpen}
				onMouseLeave={toggleOpen}
			>
				<span className="main-menu__dropdown-title">Download CV</span>
				{isOpen && (
					<div className="main-menu__dropdown-menu">
						<a className="main-menu__link" href="/cv-english.pdf" download>
							English
						</a>
						<a className="main-menu__link" href="/cv-spanish.pdf" download>
							Español
						</a>
					</div>
				)}
			</div>
		</nav>
	);
};

export default MainMenu;
