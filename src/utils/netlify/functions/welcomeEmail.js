// functions/welcome-email.js
const nodemailer = require("nodemailer");
// Or use other email services like:
// const sgMail = require('@sendgrid/mail');
// const postmark = require('postmark');

exports.handler = async function (event, context) {
	// Only allow POST
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	try {
		const { email } = JSON.parse(event.body);

		// Example using nodemailer with a service like Gmail
		// For production, use environment variables for credentials
		const transporter = nodemailer.createTransport({
			service: "gmail", // or another provider
			auth: {
				user: import.meta.env.EMAIL_USER,
				pass: import.meta.env.EMAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: '"Camilo Pinzón" <your@email.com>',
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
			}),
		};
	}
};
