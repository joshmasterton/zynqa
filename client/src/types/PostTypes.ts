export type PostType = {
	post_id: number;
	post: string;
	username: string;
	email: string;
	profile_picture_url: string;
	post_picture: string | undefined;
	likes: number;
	dislikes: number;
	comments: number;
	created_at: Date;
};
