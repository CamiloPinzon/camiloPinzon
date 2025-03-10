import { useState } from "react";
import { NavLink } from "react-router-dom";

import useResponsive from "../../hooks/useResponsive";

import "./mainMenu.scss";

const MainMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [cvDropdownOpen, setCvDropdownOpen] = useState(false);
	const { current } = useResponsive();

	const isMobile = current === "xs" || current === "sm";

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const toggleCvDropdown = () => {
		setCvDropdownOpen(!cvDropdownOpen);
	};

	const closeMenu = () => {
		setIsOpen(false);
		setCvDropdownOpen(false);
	};

	const mobileMenu = (
		<>
			<div className="main-menu__mobile-header">
				<button
					className="main-menu__mobile-toggle"
					onClick={toggleMenu}
					aria-label={isOpen ? "Close menu" : "Open menu"}
				>
					<div className={`hamburger-icon ${isOpen ? "open" : ""}`}>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</button>
			</div>

			{isOpen && (
				<div className="main-menu__mobile-drawer">
					<div className="main-menu__mobile-content">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "main-menu__link main-menu__link--active"
									: "main-menu__link"
							}
							to="/"
							onClick={closeMenu}
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
							onClick={closeMenu}
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
							onClick={closeMenu}
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
							onClick={closeMenu}
						>
							Blogs
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								isActive
									? "main-menu__link main-menu__link--active"
									: "main-menu__link"
							}
							to="/contact"
							onClick={closeMenu}
						>
							Contact
						</NavLink>
						<div className="main-menu__mobile-dropdown">
							<button
								className="main-menu__dropdown-title main-menu__mobile-dropdown-button"
								onClick={toggleCvDropdown}
							>
								Download CV {cvDropdownOpen ? "▲" : "▼"}
							</button>
							{cvDropdownOpen && (
								<div className="main-menu__mobile-dropdown-menu">
									<a
										className="main-menu__link"
										href="./public/downloads/CV_2025_oxford_en.pdf"
										download
										onClick={closeMenu}
									>
										English
									</a>
									<a
										className="main-menu__link"
										href="./public/downloads/CV_2025_oxford_es.pdf"
										download
										onClick={closeMenu}
									>
										Español
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);

	const desktopMenu = (
		<>
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
				onMouseEnter={() => setCvDropdownOpen(true)}
				onMouseLeave={() => setCvDropdownOpen(false)}
			>
				<span className="main-menu__dropdown-title">Download CV</span>
				{cvDropdownOpen && (
					<div className="main-menu__dropdown-menu">
						<a
							className="main-menu__link"
							href="./public/downloads/CV_2025_oxford_en.pdf"
							download
						>
							English
						</a>
						<a
							className="main-menu__link"
							href="./public/downloads/CV_2025_oxford_es.pdf"
							download
						>
							Español
						</a>
					</div>
				)}
			</div>
		</>
	);

	return (
		<nav className={`main-menu ${isMobile ? "main-menu--mobile" : ""}`}>
			{isMobile ? mobileMenu : desktopMenu}
		</nav>
	);
};

export default MainMenu;
