import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface NetlifyDeployFileResponse {
	url: string;
	deploy_id?: string;
	sha?: string;
	path?: string;
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

		// Step 1: Get a direct upload URL
		const deployFilesUrl = `https://api.netlify.com/api/v1/sites/${siteId}/deploys/files/${filename}`;

		console.log(`Getting upload URL from: ${deployFilesUrl}`);

		const createResponse = await fetch(deployFilesUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NETLIFY_API_TOKEN}`,
			},
		});

		if (!createResponse.ok) {
			const errorText = await createResponse.text();
			console.error(
				`Failed to get upload URL: ${createResponse.status} ${createResponse.statusText}`
			);
			console.error(`Error text: ${errorText}`);
			return {
				statusCode: createResponse.status,
				body: JSON.stringify({
					error: `Failed to get upload URL: ${createResponse.statusText}`,
				}),
			};
		}

		const uploadData =
			(await createResponse.json()) as NetlifyDeployFileResponse;
		console.log(`Got upload URL: ${uploadData.url}`);

		// Step 2: Upload the file to the provided URL
		const uploadResponse = await fetch(uploadData.url, {
			method: "PUT",
			headers: {
				"Content-Type": contentType,
				"Content-Length": buffer.length.toString(),
			},
			body: buffer,
		});

		if (!uploadResponse.ok) {
			const errorText = await uploadResponse.text();
			console.error(
				`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`
			);
			console.error(`Error text: ${errorText}`);
			return {
				statusCode: uploadResponse.status,
				body: JSON.stringify({
					error: `Failed to upload file: ${uploadResponse.statusText}`,
				}),
			};
		}

		// Step 3: Return the public URL
		// The public URL is usually in the format: https://{site-name}.netlify.app/{filename}
		const publicUrl = `https://${
			process.env.URL || `${siteId}.netlify.app`
		}/${filename}`;
		console.log(`Upload successful, public URL: ${publicUrl}`);

		return {
			statusCode: 200,
			body: JSON.stringify({ url: publicUrl }),
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
