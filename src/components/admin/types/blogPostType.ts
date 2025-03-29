export interface BlogPost {
	id: string;
	lng: "en" | "es";
	title: string;
	slug: string;
	content: string;
	summary: string;
	coverImage?: string;
	images: string[];
	tags: string[];
	author: {
		id: string;
		name: string;
		photoURL?: string;
	};
	publishedStatus: "draft" | "published";
	publishedDate?: Date;
	pairId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface BlogState {
	blog: BlogPost | null;
	loading: boolean;
	error: string | null;
}
