import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import { analytics, logEvent } from "../../utils/firebase/config";

import useResponsive from "../../hooks/useResponsive";

import "./mainMenu.scss";

const MainMenu = () => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [cvDropdownOpen, setCvDropdownOpen] = useState(false);
	const { current } = useResponsive();

	const { t } = useTranslation(NAMESPACES.COMMON);

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
	const handleCvClick = (language: string) => {
		closeMenu();
		logEvent(analytics, "cta_click", {
			cta_name: `download_cv_${language}`,
			page: window.location.pathname,
		});
		if (language === "en") navigate("./public/downloads/CV_2025_oxford_en.pdf");
		else navigate("./public/downloads/CV_2025_oxford_es.pdf");
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
							{t("common:home")}
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
							{t("common:experience")}
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
							{t("common:services")}
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
							{t("common:blogs")}
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
							{t("common:contact")}
						</NavLink>
						<div className="main-menu__mobile-dropdown">
							<button
								className="main-menu__dropdown-title main-menu__mobile-dropdown-button"
								onClick={toggleCvDropdown}
							>
								{t("common:download")} {cvDropdownOpen ? "▲" : "▼"}
							</button>
							{cvDropdownOpen && (
								<div className="main-menu__mobile-dropdown-menu">
									<a
										className="main-menu__link"
										download
										onClick={handleCvClick.bind(null, "en")}
									>
										{t("common:english")}
									</a>
									<a
										className="main-menu__link"
										href="./public/downloads/CV_2025_oxford_es.pdf"
										download
										onClick={handleCvClick.bind(null, "es")}
									>
										{t("common:spanish")}
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
				{t("common:home")}
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/experience"
			>
				{t("common:experience")}
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/services"
			>
				{t("common:services")}
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/blogs"
			>
				{t("common:blogs")}
			</NavLink>
			<div
				className="main-menu__dropdown"
				onMouseEnter={() => setCvDropdownOpen(true)}
				onMouseLeave={() => setCvDropdownOpen(false)}
			>
				<span className="main-menu__dropdown-title">
					{t("common:download")}
				</span>
				{cvDropdownOpen && (
					<div className="main-menu__dropdown-menu">
						<a
							className="main-menu__link"
							href="./public/downloads/CV_2025_oxford_en.pdf"
							download
						>
							{t("common:english")}
						</a>
						<a
							className="main-menu__link"
							href="./public/downloads/CV_2025_oxford_es.pdf"
							download
						>
							{t("common:spanish")}
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
