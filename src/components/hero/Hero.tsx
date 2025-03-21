import Button from "../button/Button";
import { ButtonProps } from "../button/Button";

import "./hero.scss";

interface HeroProps {
	bgImage: string;
	title: string;
	paragraph: string;
	button?: ButtonProps;
	style: "light" | "dark" | "light-action" | "dark-action";
}

const Hero = ({ bgImage, title, paragraph, button, style }: HeroProps) => {
	return (
		<div className={`hero ${style}`}>
			<img src={bgImage} alt={title} className="hero__image" />
			<div className={`hero__content container`}>
				<h1>{title}</h1>
				<p>
					<i>{paragraph}</i>
					{button && (
						<Button
							onClick={button.onClick}
							type="button"
							style={`${button.style}`}
						>
							{button.children}
						</Button>
					)}
				</p>
			</div>
		</div>
	);
};

export default Hero;
