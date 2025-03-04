import { useContext } from "react";
import { RecaptchaContext } from "../contexts/recaptcha.context";

interface UseRecaptchaReturn {
	executeRecaptcha: (action: string) => Promise<string | null>;
	loading: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
	const context = useContext(RecaptchaContext);

	if (!context) {
		throw new Error("useRecaptcha must be used within a RecaptchaProvider");
	}

	return context;
}
