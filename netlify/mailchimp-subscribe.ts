import { Handler } from "@netlify/functions";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const handler: Handler = async (event) => {
	console.log("Mailchimp subscribe function invoked");

	if (event.httpMethod !== "POST") {
		console.log("Method not allowed:", event.httpMethod);
		return {
			statusCode: 405,
			body: JSON.stringify({ message: "Method not allowed" }),
		};
	}

	try {
		const payload = event.body ? JSON.parse(event.body) : {};
		const email = payload.email;

		console.log("Received subscription request for:", email);

		if (!email) {
			console.log("Email is required but was not provided");
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "Email is required" }),
			};
		}

		const response = await mailchimp.lists.addListMember(
			process.env.MAILCHIMP_LIST_ID as string,
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: payload.firstName || "",
					LNAME: payload.lastName || "",
				},
				tags: ["newsletter"],
			}
		);

		console.log("Successfully subscribed to Mailchimp:", response.id);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Successfully subscribed to Mailchimp",
				id: response.id,
			}),
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error("Error subscribing to Mailchimp:", error);

		if (error.status === 400 && error.response?.text) {
			try {
				const errorData = JSON.parse(error.response.text);
				if (errorData.title === "Member Exists") {
					console.log("Member already exists in Mailchimp");
					return {
						statusCode: 200,
						body: JSON.stringify({
							message: "Already subscribed to the newsletter",
						}),
					};
				}
			} catch (parseError) {
				console.error("Error parsing Mailchimp error response:", parseError);
			}
		}

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error subscribing to newsletter",
				error: error.message || "Unknown error",
			}),
		};
	}
};

export { handler };
