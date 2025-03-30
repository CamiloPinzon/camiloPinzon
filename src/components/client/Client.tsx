import { Link } from "react-router-dom";

import Image from "../image/Image";

type Client = {
	name: string;
	image: string;
	url: string;
};

const Client = ({ name, image, url }: Client) => {
	return (
		<Link to={url} target="_blank" rel="noopener noreferrer">
			<Image src={image} alt={name} kind="medium" />
		</Link>
	);
};

export default Client;
