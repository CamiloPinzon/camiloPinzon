import "./input.scss";

interface InputProps {
	label?: string;
	name: string;
	type: "text" | "email" | "password" | "number";
	required: boolean;
	value: string;
	style: "light" | "darl";
	placeholder?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: InputProps) => {
	const { value, type, style, placeholder, label, onChange, required, name } =
		props;

	return (
		<div className="input">
			{label && <label className="input__label">{label}</label>}
			<input
				type={type}
				className={`input ${style}`}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				name={name}
			/>
		</div>
	);
};

export default Input;
