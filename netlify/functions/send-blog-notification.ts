import { Handler } from "@netlify/functions";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER_PREFIX,
});

interface BlogData {
	title: string;
	slug: string;
	summary: string;
	coverImage?: string;
	lng: "en" | "es";
}

const handler: Handler = async (event) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ message: "Method not allowed" }),
		};
	}

	try {
		const payload = event.body ? JSON.parse(event.body) : {};
		const blogData: BlogData = payload.blogData;

		if (!blogData || !blogData.title || !blogData.slug) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "Blog data is required" }),
			};
		}

		// Get the site URL from environment or construct it
		const siteUrl = process.env.URL || "https://camilopinzon.netlify.app";
		const blogUrl = `${siteUrl}/blogs/${blogData.slug}`;

		// Get the language-specific content
		const isSpanish = blogData.lng === "es";
		const subject = isSpanish
			? `📝 Nuevo artículo: ${blogData.title}`
			: `📝 New Article: ${blogData.title}`;

		const greeting = isSpanish ? "¡Hola!" : "Hello!";
		const newArticleText = isSpanish
			? "He publicado un nuevo artículo que podría interesarte:"
			: "I've just published a new article you might find interesting:";
		const readMoreText = isSpanish ? "Leer artículo completo" : "Read full article";
		const thanksText = isSpanish
			? "Gracias por suscribirte a mi newsletter. Espero que disfrutes este contenido."
			: "Thank you for subscribing to my newsletter. I hope you enjoy this content.";
		const bestRegards = isSpanish ? "Saludos cordiales" : "Best regards";
		const unsubscribeText = isSpanish
			? "Estás recibiendo este correo porque te suscribiste a mi newsletter."
			: "You're receiving this email because you subscribed to my newsletter.";

		// Create the email HTML
		const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background-color: #0066cc;
      padding: 30px 20px;
      text-align: center;
    }
    
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      margin: 0;
      font-weight: 700;
    }
    
    .content {
      padding: 30px;
    }
    
    .content p {
      margin-bottom: 16px;
      font-size: 16px;
    }
    
    .blog-card {
      background-color: #f8f9fa;
      border-left: 4px solid #0066cc;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .blog-card h2 {
      color: #0066cc;
      font-size: 20px;
      margin: 0 0 10px 0;
    }
    
    .blog-card p {
      color: #555;
      margin-bottom: 15px;
    }
    
    ${
			blogData.coverImage
				? `
    .blog-image {
      width: 100%;
      max-width: 540px;
      height: auto;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    `
				: ""
		}
    
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background-color: #0066cc;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin-top: 10px;
    }
    
    .btn:hover {
      background-color: #0052a3;
    }
    
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #666;
      border-top: 1px solid #eee;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    @media (max-width: 480px) {
      .email-wrapper {
        padding: 10px;
      }
      
      .header {
        padding: 20px 15px;
      }
      
      .header h1 {
        font-size: 20px;
      }
      
      .content {
        padding: 20px 15px;
      }
      
      .blog-card h2 {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <h1>${isSpanish ? "Nuevo Artículo Publicado" : "New Article Published"}</h1>
      </div>
      
      <div class="content">
        <p>${greeting}</p>
        
        <p>${newArticleText}</p>
        
        <div class="blog-card">
          ${
						blogData.coverImage
							? `<img src="${blogData.coverImage}" alt="${blogData.title}" class="blog-image" />`
							: ""
					}
          <h2>${blogData.title}</h2>
          <p>${blogData.summary}</p>
          <a href="${blogUrl}" class="btn">${readMoreText} →</a>
        </div>
        
        <p>${thanksText}</p>
        
        <div class="signature">
          <p>${bestRegards},<br>Camilo Pinzón</p>
        </div>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Camilo Pinzon Developer. ${isSpanish ? "Todos los derechos reservados" : "All rights reserved"}.</p>
        <p>${unsubscribeText}</p>
        <p><a href="*|UNSUB|*" style="color: #0066cc; text-decoration: none;">${isSpanish ? "Darse de baja" : "Unsubscribe"}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

		// Create campaign in Mailchimp
		try {
			// First, create the campaign
			const campaign = await mailchimp.campaigns.create({
				type: "regular",
				recipients: {
					list_id: process.env.MAILCHIMP_LIST_ID as string,
					segment_opts: {
						match: "all",
						conditions: [
							{
								condition_type: "StaticSegment",
								field: "static_segment",
								op: "static_is",
								value: parseInt(
									process.env.MAILCHIMP_NEWSLETTER_SEGMENT_ID || "0"
								),
							},
						],
					},
				},
				settings: {
					subject_line: subject,
					preview_text: blogData.summary.substring(0, 150),
					title: `Blog: ${blogData.title} - ${new Date().toISOString()}`,
					from_name: "Camilo Pinzón",
					reply_to: process.env.EMAIL_FROM || "hello@camilopinzon.com",
				},
			});

			// Set the campaign content
			await mailchimp.campaigns.setContent(campaign.id, {
				html: htmlEmail,
			});

			// Send the campaign
			await mailchimp.campaigns.send(campaign.id);

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "Blog notification sent successfully",
					campaignId: campaign.id,
				}),
			};
		} catch (mailchimpError) {
			console.error("Mailchimp API Error:", mailchimpError);

			// If segment doesn't exist, try sending to the whole list
			try {
				const campaign = await mailchimp.campaigns.create({
					type: "regular",
					recipients: {
						list_id: process.env.MAILCHIMP_LIST_ID as string,
					},
					settings: {
						subject_line: subject,
						preview_text: blogData.summary.substring(0, 150),
						title: `Blog: ${blogData.title} - ${new Date().toISOString()}`,
						from_name: "Camilo Pinzón",
						reply_to: process.env.EMAIL_FROM || "hello@camilopinzon.com",
					},
				});

				await mailchimp.campaigns.setContent(campaign.id, {
					html: htmlEmail,
				});

				await mailchimp.campaigns.send(campaign.id);

				return {
					statusCode: 200,
					body: JSON.stringify({
						message: "Blog notification sent successfully (to entire list)",
						campaignId: campaign.id,
					}),
				};
			} catch (retryError) {
				console.error("Retry failed:", retryError);
				throw retryError;
			}
		}
	} catch (error) {
		const generalError = error as Error & { status?: number };
		console.error("Error sending blog notification:", generalError);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error sending blog notification",
				error: generalError.message || "Unknown error",
			}),
		};
	}
};

export { handler };

