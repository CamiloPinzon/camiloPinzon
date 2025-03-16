import { Handler } from "@netlify/functions";
import mailchimp from "@mailchimp/mailchimp_marketing";
import nodemailer from "nodemailer";

// Define interfaces for error types
interface MailchimpError {
	status: number;
	response?: {
		text: string;
	};
	message?: string;
}

interface MailchimpErrorResponse {
	title?: string;
	detail?: string;
	status?: number;
}

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const handler: Handler = async (event) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ message: "Method not allowed" }),
		};
	}

	try {
		const payload = event.body ? JSON.parse(event.body) : {};
		const email = payload.email;

		if (!email) {
			return {
				statusCode: 400,
				body: JSON.stringify({ message: "Email is required" }),
			};
		}

		// Log configuration for debugging
		console.log(`Using Mailchimp list ID: ${process.env.MAILCHIMP_LIST_ID}`);
		console.log(`Using server prefix: ${process.env.MAILCHIMP_SERVER_PREFIX}`);

		try {
			const response = await mailchimp.lists.addListMember(
				process.env.MAILCHIMP_LIST_ID as string,
				{
					email_address: email,
					status: "subscribed",
					merge_fields: {
						FNAME: payload.firstName || "New Subscriber", // Fixed typo in "Subscriber"
						LNAME: payload.lastName || "",
					},
					tags: ["newsletter"],
				}
			);

			// If we get here, the Mailchimp subscription was successful
			console.log("Successfully subscribed to Mailchimp:", response.id);

			// Now handle email sending
			const transporter = nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: parseInt(process.env.EMAIL_PORT || "587"),
				secure: process.env.EMAIL_SECURE === "true",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
				tls: {
					rejectUnauthorized: true,
				},
				pool: true,
				maxConnections: 5,
			});

			const firstName = payload.firstName || "there";

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
    
    .content ul {
      padding-left: 20px;
      margin-bottom: 24px;
    }
    
    .content ul li {
      margin-bottom: 8px;
      line-height: 1.5;
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
    
    /* Responsive styles */
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
      
      .content p, .content ul li {
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <h1>Welcome to Our Newsletter!</h1>
      </div>
      
      <div class="content">
        <p>Hello ${firstName},</p>
        
        <p>Thank you for subscribing to our newsletter. We're excited to have you join our community!</p>
        
        <p>Here's what you can expect from us:</p>
        <ul>
          <li>Regular updates about new developments, development education content, and more</li>
          <li>Tips and insights from our experts</li>
        </ul>
        
        <p>If you have any questions, feel free to reply to this email or contact us at ${
					process.env.EMAIL_FROM
				}.</p>
        
        <div class="signature">
          <p>Best regards,<br>Camilo Pinz&oacute;n</p>
        </div>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        <p>You're receiving this email because you signed up for our newsletter.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

			// Send the email
			try {
				await transporter.sendMail({
					from: `"Camilo Pinz&oacute;n" <${process.env.EMAIL_FROM}>`,
					to: email,
					subject: "Welcome to Our Newsletter!",
					html: htmlEmail,
					headers: {
						Precedence: "bulk",
					},
					text: "You're receiving this email because you signed up for our newsletter.",
				});
				console.log("Welcome email sent successfully");
			} catch (emailError) {
				console.error("Error sending welcome email:", emailError);
				// Continue execution even if email fails
			}

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: "Successfully subscribed to Mailchimp",
					id: response.id,
				}),
			};
		} catch (error) {
			// Cast to our defined error type
			const mailchimpError = error as MailchimpError;
			console.error(
				"Mailchimp API Error:",
				JSON.stringify(mailchimpError, null, 2)
			);

			// Check for Member Exists error
			if (mailchimpError.status === 400 && mailchimpError.response) {
				try {
					const errorResponse = JSON.parse(
						mailchimpError.response.text
					) as MailchimpErrorResponse;
					console.log("Parsed Mailchimp error:", errorResponse);

					if (errorResponse.title === "Member Exists") {
						return {
							statusCode: 200, // Return 200 for already subscribed members
							body: JSON.stringify({
								message: "Already subscribed to the newsletter",
							}),
						};
					}

					// Return the specific error from Mailchimp for other 400 errors
					return {
						statusCode: 400,
						body: JSON.stringify({
							message: "Error subscribing to newsletter",
							error: errorResponse.title || "Mailchimp API Error",
							detail: errorResponse.detail || "No additional details",
						}),
					};
				} catch (parseError) {
					console.error("Error parsing Mailchimp error response:", parseError);
				}
			}

			throw mailchimpError; // Re-throw to be caught by outer try-catch
		}
	} catch (error) {
		const generalError = error as Error & {
			status?: number;
			response?: { text: string };
		};
		console.error("Error in subscription handler:", generalError);

		// Provide more detailed error information
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error subscribing to newsletter",
				error: generalError.message || "Unknown error",
				statusCode: generalError.status || 500,
				details: generalError.response
					? generalError.response.text
					: "No additional details",
			}),
		};
	}
};

export { handler };
