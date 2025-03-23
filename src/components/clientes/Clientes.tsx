import Image from "../image/Image";

import "./clientes.scss";

const Clientes = () => {
	return (
		<div className="clientes">
			<h2 className="clientes__title">Brands That Trust My Work</h2>
			<p className="clientes__text">
				I’ve helped businesses create powerful digital experiences
				<br />
				Yours could be next.
			</p>
			<div className="clientes__logos">
				<div className="clientes__logos--item">
					<Image
						src="./images/logo-motomercado.png"
						alt="Motomercado"
						kind="medium"
					/>
				</div>
			</div>
		</div>
	);
};

export default Clientes;
