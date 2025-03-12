import { useEffect } from "react";

interface SEOProps {
	title: string;
	description: string;
	name?: string;
	type?: string;
	image?: string;
}

export function useSEO({
	title,
	description,
	name = "Camilo Pinzón",
	type = "website",
	image,
}: SEOProps) {
	useEffect(() => {
		// Update standard meta tags
		document.title = title;
		document
			.querySelector('meta[name="description"]')
			?.setAttribute("content", description);

		// Update OpenGraph meta tags
		document
			.querySelector('meta[property="og:title"]')
			?.setAttribute("content", title);
		document
			.querySelector('meta[property="og:description"]')
			?.setAttribute("content", description);
		document
			.querySelector('meta[property="og:type"]')
			?.setAttribute("content", type);

		if (image) {
			const ogImage = document.querySelector('meta[property="og:image"]');
			if (ogImage) {
				ogImage.setAttribute("content", image);
			} else {
				const newOgImage = document.createElement("meta");
				newOgImage.setAttribute("property", "og:image");
				newOgImage.setAttribute("content", image);
				document.head.appendChild(newOgImage);
			}
		}

		// Update Twitter Card meta tags
		document
			.querySelector('meta[name="twitter:card"]')
			?.setAttribute("content", "summary_large_image");
		document
			.querySelector('meta[name="twitter:creator"]')
			?.setAttribute("content", name);
		document
			.querySelector('meta[name="twitter:title"]')
			?.setAttribute("content", title);
		document
			.querySelector('meta[name="twitter:description"]')
			?.setAttribute("content", description);

		if (image) {
			const twitterImage = document.querySelector('meta[name="twitter:image"]');
			if (twitterImage) {
				twitterImage.setAttribute("content", image);
			} else {
				const newTwitterImage = document.createElement("meta");
				newTwitterImage.setAttribute("name", "twitter:image");
				newTwitterImage.setAttribute("content", image);
				document.head.appendChild(newTwitterImage);
			}
		}
	}, [title, description, name, type, image]);
}
