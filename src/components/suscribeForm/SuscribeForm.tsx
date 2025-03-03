import { useState } from "react";

import Button from "../button/Button";
import Input from "../Input/Input";

import "./susbribeForm.scss";

const defaultFormFields = {
	email: "",
	honeypot: "",
};

const SuscribeForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields);
	const { email, honeypot } = formFields;
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormFields({ ...formFields, [name]: value });
	};

	const handleSubmit = () => {
		if (honeypot) return;
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
			<Input
				type="text"
				name="honeypot"
				placeholder="honeypot"
				style="honeypot"
				value={honeypot}
				onChange={handleOnChange}
				required={false}
			/>
			<Button type="submit" style="primary">
				Suscribe
			</Button>
		</form>
	);
};

export default SuscribeForm;
