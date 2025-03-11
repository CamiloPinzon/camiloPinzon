import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import FormData from "form-data";

export const handler: Handler = async (event) => {
	const siteId = process.env.SITE_ID;
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	try {
		const { image, filename } = JSON.parse(event.body || "{}");
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Data, "base64");

		const form = new FormData();
		form.append("file", buffer, { filename });

		const response = await fetch(
			`https://api.netlify.com/api/v1/sites/${siteId}/files`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
				},
				body: form,
			}
		);

		const data = (await response.json()) as { url: string };

		return {
			statusCode: 200,
			body: JSON.stringify({ url: data.url }),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
};
