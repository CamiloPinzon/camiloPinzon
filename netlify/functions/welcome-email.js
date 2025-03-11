// netlify/functions/welcome-email.js
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
	// Only allow POST
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: "Method Not Allowed" }),
		};
	}

	try {
		// Parse the incoming request body
		const { email } = JSON.parse(event.body);

		if (!email) {
			return {
				statusCode: 400,
				body: JSON.stringify({ success: false, message: "Email is required" }),
			};
		}

		// Create email transporter
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: import.meta.env.VITE_EMAIL_USER,
				pass: import.meta.env.VITE_EMAIL_PASSWORD,
			},
		});

		// Email content
		const mailOptions = {
			from: `"Your Brand" <${import.meta.env.VITE_EMAIL_USER}>`,
			to: email,
			subject: "Welcome to Our Newsletter!",
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Our Newsletter!</h1>
          <p>Thank you for subscribing! We're excited to share our latest updates with you.</p>
          <p>You'll now receive our updates directly to your inbox.</p>
          <p>Best regards,<br>Your Brand Team</p>
        </div>
      `,
		};

		// Send email
		await transporter.sendMail(mailOptions);

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
				message: "Welcome email sent successfully",
			}),
		};
	} catch (error) {
		console.error("Error sending welcome email:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				success: false,
				message: "Failed to send welcome email",
				error: error.message,
			}),
		};
	}
};
