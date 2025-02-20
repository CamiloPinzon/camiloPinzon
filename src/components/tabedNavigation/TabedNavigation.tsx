import { useState } from "react";

import Divisor from "../divisor/Divisor";
import TechStack from "../techStak/TechStack";

import stackContent from "../../data/techStack.json";
import "./tabedNavigation.scss";

const TabedNavigation = () => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTab = (tab: number) => {
		setActiveTab(tab);
	};

	return (
		<div className="tabed-navigation">
			<div className="tabed-navigation__tabs">
				<div
					className="tabed-navigation__tabs-tab"
					onClick={() => handleTab(0)}
				>
					Tech Stak
				</div>
			</div>
			<Divisor />
			<div className="tabed-navigation__content">
				{activeTab === 0 && (
					<div className="tabed-navigation__content-container">
						{stackContent.map(({ id, img, name }) => (
							<TechStack key={id} img={img} name={name} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TabedNavigation;
