export interface BlogPost {
	id: string;
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
	createdAt: Date;
	updatedAt: Date;
}

export interface BlogState {
	blog: BlogPost | null;
	loading: boolean;
	error: string | null;
}
