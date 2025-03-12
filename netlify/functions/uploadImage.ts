import { Handler } from "@netlify/functions";
import fetch from "node-fetch";
import FormData from "form-data";

interface NetlifyFileResponse {
	url: string;
	id?: string;
	name?: string;
	size?: number;
	[key: string]: unknown;
}

interface NetlifyErrorResponse {
	message: string;
	code?: string;
	[key: string]: unknown;
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
			contentType,
		});

		console.log(
			`Uploading to: https://api.netlify.com/api/v1/sites/${siteId}/files`
		);

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

		// Log response details for debugging
		console.log(`Response status: ${response.status}`);
		console.log(`Response status text: ${response.statusText}`);

		// Handle non-JSON responses
		const contentTypeHeader = response.headers.get("content-type");
		if (!contentTypeHeader || !contentTypeHeader.includes("application/json")) {
			const textResponse = await response.text();
			console.error("Non-JSON response:", textResponse);
			return {
				statusCode: response.status,
				body: JSON.stringify({
					error: `Netlify API error: ${
						response.statusText
					}. Response: ${textResponse.substring(0, 100)}...`,
				}),
			};
		}

		if (!response.ok) {
			const errorData = (await response.json()) as NetlifyErrorResponse;
			console.error("Netlify API Error:", errorData);
			return {
				statusCode: response.status,
				body: JSON.stringify({
					error: `Netlify API error: ${
						errorData.message || response.statusText
					}`,
				}),
			};
		}

		const data = (await response.json()) as NetlifyFileResponse;
		console.log("Upload successful, URL:", data.url);

		return {
			statusCode: 200,
			body: JSON.stringify({ url: data.url }),
		};
	} catch (error) {
		console.error(
			"Function error:",
			error instanceof Error ? error.message : String(error)
		);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			}),
		};
	}
};
