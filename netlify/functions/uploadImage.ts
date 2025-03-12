import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import FormData from "form-data";

interface NetlifyFileResponse {
	url: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any; // For other properties that might be in the response
}

export const handler: Handler = async (event) => {
	const siteId = process.env.SITE_ID;
	if (!siteId) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Missing SITE_ID environment variable" }),
		};
	}

	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: "Method Not Allowed" }),
		};
	}

	try {
		const { image, filename } = JSON.parse(event.body || "{}");

		if (!image) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Missing image data" }),
			};
		}

		// Extract the MIME type and base64 data
		const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

		if (!matches || matches.length !== 3) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Invalid image data format" }),
			};
		}

		const contentType = matches[1];
		const base64Data = matches[2];
		const buffer = Buffer.from(base64Data, "base64");

		const form = new FormData();
		form.append("file", buffer, {
			filename,
			contentType, // Add the content type here
		});

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

		const data = (await response.json()) as NetlifyFileResponse;

		if (!response.ok) {
			console.error("Netlify API Error:", data);
			return {
				statusCode: response.status,
				body: JSON.stringify({
					error: `Netlify API error: ${
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(data as any).message || response.statusText
					}`,
				}),
			};
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ url: data.url }),
		};
	} catch (error) {
		console.error("Function error:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: (error as Error).message || "Unknown error occurred",
			}),
		};
	}
};
