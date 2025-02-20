import "./button.scss";

interface ButtonProps {
	children: React.ReactNode;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	type: "button" | "submit" | "reset";
	style: "primary" | "secondary";
}

const Button = ({ children, onClick, type, style }: ButtonProps) => {
	return (
		<button className={`button button__${style}`} onClick={onClick} type={type}>
			{children}
		</button>
	);
};

export default Button;
