import "./image.scss";

interface ImageProps {
	src: string;
	alt: string;
	kind?: string;
}

const Image = ({ src, alt, kind }: ImageProps) => {
	return (
		<div className={`image image__${kind}`}>
			<img src={src} alt={alt} />
		</div>
	);
};

export default Image;
