import "./button.scss";

export interface ButtonProps {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	type: "button" | "submit" | "reset";
	style: "primary" | "secondary";
	isReacptcha?: boolean;
}

const Button = ({
	children,
	onClick,
	type,
	style,
	isReacptcha,
}: ButtonProps) => {
	return (
		<button
			className={`button button__${style} ${isReacptcha && "g-recaptcha"}`}
			onClick={onClick}
			type={type}
			{...(isReacptcha && {
				"data-sitekey": import.meta.env.VITE_SITE_KEY,
				"data-callback": "onSubmit",
				"data-action": "submit",
			})}
		>
			{children}
		</button>
	);
};

export default Button;
