import { useState } from "react";

import Button from "../button/Button";
import Input from "../Input/Input";

import "./susbribeForm.scss";

const defaultFormFields = {
	email: "",
};

const SuscribeForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { email } = formFields;
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	const handleSubmit = () => {
		alert("send form");
	};
	return (
		<form onSubmit={handleSubmit}>
			<Input
				type="email"
				name="email"
				placeholder="your@email.com"
				style="light"
				value={email}
				onChange={handleOnChange}
				required
			/>
			<Button type="submit" style="primary">
				Suscribe
			</Button>
		</form>
	);
};

export default SuscribeForm;
