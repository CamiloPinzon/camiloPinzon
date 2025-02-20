import "./techStack.scss";

interface TechStackPops {
	img: string;
	name: string;
}

const TechStack = ({ img, name }: TechStackPops) => {
	return (
		<div className="tech-stack">
			<div className="tech-stack__item">
				<img src={img} alt={name} className="tech-stack__image" />
				<h3 className="tech-stack__name">{name}</h3>
			</div>
		</div>
	);
};

export default TechStack;
