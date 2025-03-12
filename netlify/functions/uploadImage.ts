import { Handler } from "@netlify/functions";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const handler: Handler = async (event) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: "Method Not Allowed" }),
		};
	}

	try {
		const { image } = JSON.parse(event.body || "{}");

		if (!image) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Missing image data" }),
			};
		}

		// Upload to Cloudinary
		const uploadResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				image,
				{
					folder: "netlify-uploads",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
		});

		return {
			statusCode: 200,
			body: JSON.stringify({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				url: (uploadResponse as any).secure_url,
			}),
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
