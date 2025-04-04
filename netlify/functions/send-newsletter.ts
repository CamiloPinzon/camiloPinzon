import { Handler } from "@netlify/functions";
import mailchimp from "@mailchimp/mailchimp_marketing";
import {
	collection,
	getDocs,
	query,
	orderBy,
	limit,
	where,
	DocumentData,
} from "firebase/firestore";

import { BlogPost } from "../../src/components/admin/types/blogPostType";

import { db } from "../../src/utils/firebase/config";

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const handler: Handler = async (event) => {
	let englishBlog: BlogPost | null = {} as BlogPost;
	let spanishBlog: BlogPost | null = {} as BlogPost;

	try {
		if (event.httpMethod !== "POST") {
			return {
				statusCode: 405,
				body: JSON.stringify({ message: "Method not allowed" }),
			};
		}

		const token = event.headers.authorization?.split(" ")[1];
		if (token !== process.env.NEWSLETTER_TOKEN) {
			return {
				statusCode: 401,
				body: JSON.stringify({ message: "Unauthorized" }),
			};
		}

		const blogsRef = collection(db, "blogs");

		// Consulta para blog en inglés
		const englishQuery = query(
			blogsRef,
			where("lng", "==", "en"),
			orderBy("updatedAt", "desc"),
			limit(1)
		);

		// Consulta para blog en español
		const spanishQuery = query(
			blogsRef,
			where("lng", "==", "es"),
			orderBy("updatedAt", "desc"),
			limit(1)
		);

		const englishSnapshot = await getDocs(englishQuery);
		englishSnapshot.forEach((doc) => {
			const data = doc.data() as DocumentData;
			englishBlog = {
				id: doc.id,
				title: data.title as string,
				summary: data.summary as string,
				coverImage: data.coverImage as string,
				lng: data.lng as "en" | "es",
				updatedAt: data.updatedAt,
				slug: data.slug as string,
				content: (data.content as string) || "",
				images: (data.images as string[]) || [],
				tags: (data.tags as string[]) || [],
				author: (data.author as { id: string; name: string; photoURL?: string }) || { id: "unknown", name: "Unknown" },
				publishedStatus: (data.publishedStatus === "draft" || data.publishedStatus === "published") ? data.publishedStatus : "draft",
				createdAt: data.createdAt || new Date().toISOString(),
			};
		});

		const spanishSnapshot = await getDocs(spanishQuery);
		spanishSnapshot.forEach((doc) => {
			const data = doc.data() as DocumentData;
			spanishBlog = {
				id: doc.id,
				title: data.title as string,
				summary: data.summary as string,
				coverImage: data.coverImage as string,
				lng: data.lng,
				updatedAt: data.updatedAt,
				slug: data.slug as string,
				content: (data.content as string) || "",
				images: (data.images as string[]) || [],
				tags: (data.tags as string[]) || [],
				author: (data.author as { id: string; name: string; photoURL?: string }) || { id: "unknown", name: "Unknown" },
				publishedStatus: (data.publishedStatus === "draft" || data.publishedStatus === "published") ? data.publishedStatus : "draft",
				createdAt: data.createdAt || new Date().toISOString(),
			};
		});

		if (!englishBlog || !spanishBlog) {
			return {
				statusCode: 404,
				body: JSON.stringify({ message: "Blogs not found" }),
			};
		}

		const emailContent = generateEmailTemplate(englishBlog, spanishBlog);

		const campaignResponse = await mailchimp.campaigns.create({
			type: "regular",
			recipients: {
				list_id: process.env.MAILCHIMP_LIST_ID as string,
			},
			settings: {
				subject_line: `New Blog Posts: ${englishBlog.title} | ${spanishBlog.title}`,
				preview_text: "Check out our latest blog posts",
				title: `Blog Newsletter - ${new Date().toLocaleDateString()}`,
				from_name: process.env.SENDER_NAME || "Camilo Pinzón Developer Blog",
				reply_to: process.env.SENDER_EMAIL || "camilopinzondeveloper@gmail.com",
				auto_footer: true,
			},
		});

		await mailchimp.campaigns.setContent(campaignResponse.id, {
			html: emailContent,
		});

		await mailchimp.campaigns.send(campaignResponse.id);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Email sent successfully",
				campaignId: campaignResponse.id,
			}),
		};
	} catch (error: unknown) {
		console.error("Error sending newsletter:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error sending newsletter",
				error: error instanceof Error ? error.message : String(error),
			}),
		};
	}
};

function generateEmailTemplate(
	englishBlog: BlogPost,
	spanishBlog: BlogPost
): string {
	return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Latest Blog Posts</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #1A1A2E;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
          }
          .header {
            background-color: #0052A3;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .blog-post {
            margin-bottom: 30px;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 20px;
          }
          .blog-post:last-child {
            border-bottom: none;
          }
          .blog-title {
            color: #1A1A2E;
            font-size: 22px;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .blog-summary {
            margin-bottom: 15px;
          }
          .blog-image {
            width: 100%;
            max-height: 250px;
            object-fit: cover;
            margin-bottom: 15px;
          }
          .blog-language {
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
          }
          .button {
            background-color: #e43f5a;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
          }
          .footer {
            background-color: #1A1A2E;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 12px;
          }
          .footer a {
            color: white;
          }
          @media only screen and (max-width: 600px) {
            .container {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Latest Blog Posts</h1>
          </div>
          <div class="content">
            <p>Hello there,</p>
            <p>We've just published new blog posts that we thought you might enjoy:</p>
            
            <!-- English Blog Post -->
            <div class="blog-post">
              <div class="blog-language">English</div>
              <img src="${englishBlog.coverImage}" alt="${
		englishBlog.title
	}" class="blog-image">
              <h2 class="blog-title">${englishBlog.title}</h2>
              <div class="blog-summary">${englishBlog.summary}</div>
              <a href="${process.env.WEBSITE_URL}blogs/${
		englishBlog.slug
	}" class="button">Read More</a>
            </div>
            
            <!-- Spanish Blog Post -->
            <div class="blog-post">
              <div class="blog-language">Español</div>
              <img src="${spanishBlog.coverImage}" alt="${
		spanishBlog.title
	}" class="blog-image">
              <h2 class="blog-title">${spanishBlog.title}</h2>
              <div class="blog-summary">${spanishBlog.summary}</div>
              <a href="${process.env.WEBSITE_URL}blogs/${
		spanishBlog.slug
	}" class="button">Leer Más</a>
            </div>
            
            <p>Thank you for subscribing to our newsletter!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Blog Name. All rights reserved.</p>
            <p><a href="*|UNSUB|*">Unsubscribe</a> | <a href="*|UPDATE_PROFILE|*">Update Preferences</a></p>
          </div>
        </div>
      </body>
    </html>`;
}

export { handler };
