import "./image.scss";

interface ImageProps {
	src: string;
	alt: string;
	kind?: string;
}

const Image = ({ src, alt, kind }: ImageProps) => {
	return (
		<div className={`image image__${kind}`}>
			<img
				src={src}
				alt={alt}
				{...(kind === "full_hero" && {
					loading: "eager",
					fetchPriority: "high",
				})}
				title={alt}
			/>
		</div>
	);
};

export default Image;
