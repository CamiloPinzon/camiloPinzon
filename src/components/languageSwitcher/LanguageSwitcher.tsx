import { useTranslation } from "react-i18next";
import { LanguageOptions, SupportedLanguage } from "../../i18n/languageOptions";

import "./languageSwitcher.scss";

type LanguageSwitcherProps = {
	variant?: "dropdown" | "toggle" | "flags";
};

const LanguageSwitcher = ({ variant = "dropdown" }: LanguageSwitcherProps) => {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language as SupportedLanguage;

	const handleLanguageChange = (language: SupportedLanguage) => {
		i18n.changeLanguage(language);
	};

	// Dropdown
	if (variant === "dropdown") {
		return (
			<div className="language-selector language-selector--dropdown">
				<select
					value={currentLanguage}
					onChange={(e) =>
						handleLanguageChange(e.target.value as SupportedLanguage)
					}
					className="language-selector__select"
				>
					{LanguageOptions.map((lang) => (
						<option
							value={lang.code}
							key={lang.code}
							className="language-selector__option"
						>
							{lang.flag} {lang.name}
						</option>
					))}
				</select>
			</div>
		);
	}

	// Toggle (only works for exactly 2 languages)
	if (variant === "toggle") {
		return (
			<div
				className="language-selector language-selector--toggle"
				data-current-lang={currentLanguage}
			>
				<div
					className="language-selector__slider"
					onClick={() => {
						const newLanguage = currentLanguage === "en" ? "es" : "en";
						handleLanguageChange(newLanguage);
					}}
				>
					<div className="language-selector__current-lang"></div>
					<span
						className={`language-selector__option ${
							currentLanguage === "en"
								? "language-selector__option--active"
								: ""
						}`}
					>
						EN
					</span>
					<span
						className={`language-selector__option ${
							currentLanguage === "es"
								? "language-selector__option--active"
								: ""
						}`}
					>
						ES
					</span>
				</div>
			</div>
		);
	}

	// Flags
	return (
		<div className="language-selector language-selector--flags">
			{LanguageOptions.map((lang) => (
				<button
					key={lang.code}
					onClick={() => handleLanguageChange(lang.code)}
					className={`language-selector__button ${
						currentLanguage === lang.code
							? "language-selector__button--active"
							: ""
					}`}
					aria-label={`Switch to ${lang.name}`}
				>
					{lang.flag}
				</button>
			))}
		</div>
	);
};

export default LanguageSwitcher;
