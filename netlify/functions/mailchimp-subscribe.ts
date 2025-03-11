import { Handler } from "@netlify/functions";
import mailchimp from "@mailchimp/mailchimp_marketing";
import nodemailer from "nodemailer";

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
					FNAME: payload.firstName || "New Suscriber",
					LNAME: payload.lastName || "",
				},
				tags: ["newsletter"],
			}
		);

		console.log("Successfully subscribed to Mailchimp:", response.id);

		// Now send a welcome email
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT || "587"),
			secure: process.env.EMAIL_SECURE === "true",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		const firstName = payload.firstName || "there";

		// Create an HTML email template
		const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 10px;
            text-align: center;
            border-bottom: 1px solid #e0e0e0;
          }
          .footer {
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
            color: #666;
          }
          h1 {
            color: #2c3e50;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Newsletter!</h1>
          </div>
          
          <p>Hello ${firstName},</p>
          
          <p>Thank you for subscribing to our newsletter. We're excited to have you join our community!</p>
          
          <p>Here's what you can expect from us:</p>
          <ul>
            <li>Regular updates about new developments, development education content, and more</li>
            <li>Tips and insights from our experts</li>
          </ul>
          
          <p>If you have any questions, feel free to reply to this email or contact us at ${process.env.EMAIL_FROM}.</p>
          
          <p>Best regards,<br>Camilo Pinz&oacute;n</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p>You're receiving this email because you signed up for our newsletter.</p>
          </div>
        </div>
      </body>
      </html>
    `;

		// Send the email
		try {
			await transporter.sendMail({
				from: `"Your Name" <${process.env.EMAIL_FROM}>`,
				to: email,
				subject: "Welcome to Our Newsletter!",
				html: htmlEmail,
			});

			console.log("Welcome email sent successfully");
		} catch (emailError) {
			// Log email error but don't fail the subscription process
			console.error("Error sending welcome email:", emailError);
		}

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
