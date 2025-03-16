// src/services/mailchimpService.ts
interface SubscriberData {
	email: string;
}

/**
 * Service to handle Mailchimp operations via Netlify Functions
 */
export const mailchimpService = {
	/**
	 * Subscribe a user to the Mailchimp newsletter
	 * @param data User data to subscribe
	 * @returns Promise resolving to the response data
	 */
	async subscribeUser(
		data: SubscriberData
	): Promise<{ success: boolean; message: string; id?: string }> {
		try {
			const response = await fetch("/.netlify/functions/mailchimp-subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (!response.ok) {
				console.error("Mailchimp subscription failed:", responseData);
				return {
					success: false,
					message: responseData.message || "Failed to subscribe to newsletter",
				};
			}
			return {
				success: true,
				message: "Successfully subscribed to newsletter",
				id: responseData.id,
			};
		} catch (error) {
			console.error("Error in mailchimpService.subscribeUser:", error);
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "An unknown error occurred",
			};
		}
	},
};
