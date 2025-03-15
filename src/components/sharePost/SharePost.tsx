import "./sharePost.scss";

interface SharePostProps {
	title: string;
	url: string;
}

const SharePost: React.FC<SharePostProps> = ({ title, url }) => {
	const encodedTitle = encodeURIComponent(title);
	const encodedUrl = encodeURIComponent(url);

	const shareLinks = {
		facebook: `https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=${encodedUrl}&display=popup&ref=plugin&src=share_button`,
		twitter: `https://x.com/intent/post?title=${encodedTitle}&text=${encodedUrl}`,
		linkedin: `https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=${encodedUrl}&text=${encodedTitle}`,
		whatsapp: `https://wa.me/?text=${encodedUrl}`,
	};

	return (
		<div className="share-post">
			<span className="share-post__label">Share this post:</span>
			<ul className="share-post__list">
				<li className="share-post__item">
					<a
						href={shareLinks.facebook}
						target="_blank"
						rel="noopener noreferrer"
						className="share-post__link share-post__link--facebook"
					>
						Facebook
					</a>
				</li>
				<li className="share-post__item">
					<a
						href={shareLinks.twitter}
						target="_blank"
						rel="noopener noreferrer"
						className="share-post__link share-post__link--twitter"
					>
						Twitter
					</a>
				</li>
				<li className="share-post__item">
					<a
						href={shareLinks.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="share-post__link share-post__link--linkedin"
					>
						LinkedIn
					</a>
				</li>
				<li className="share-post__item">
					<a
						href={shareLinks.whatsapp}
						target="_blank"
						rel="noopener noreferrer"
						className="share-post__link share-post__link--whatsapp"
					>
						WhatsApp
					</a>
				</li>
			</ul>
		</div>
	);
};

export default SharePost;
