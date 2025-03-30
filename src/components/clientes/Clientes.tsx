import { useTranslation } from "react-i18next";

import { NAMESPACES } from "../../i18n/namespaces";
import Client from "../client/Client";
import Clients from "../../data/clients.json";

import "./clientes.scss";

const Clientes = () => {
	const { t } = useTranslation(NAMESPACES.CLIENTES);
	return (
		<div className="clientes">
			<h2 className="clientes__title">{t("clients:title")}</h2>
			<p className="clientes__text">{`${t("clients:text")}`}</p>
			<div className="clientes__logos">
				{Clients.clients.map((client) => (
					<Client key={client.id} name={client.name} image={client.image} url={client.url} />
				))}
			</div>
		</div>
	);
};

export default Clientes;
