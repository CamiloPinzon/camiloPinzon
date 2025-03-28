import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import Image from "../image/Image";

import "./clientes.scss";

const Clientes = () => {
	const { t } = useTranslation(NAMESPACES.CLIENTES);
	return (
		<div className="clientes">
			<h2 className="clientes__title">{t("clients:title")}</h2>
			<p className="clientes__text">{`${t("clients:text")}`}</p>
			<div className="clientes__logos">
				<div className="clientes__logos--item">
					<Image
						src="./images/logo-motomercado.png"
						alt="Motomercado"
						kind="medium"
					/>
				</div>
				<div className="clientes__logos--item">
					<Image
						src="./images/epicRosa-300x300.webp"
						alt="Epic Media"
						kind="medium"
					/>
				</div>
				<div className="clientes__logos--item">
					<Image
						src="./images/PYL_LOGO.png"
						alt="P&L Contructor"
						kind="medium"
					/>
				</div>
			</div>
		</div>
	);
};

export default Clientes;
