import MainMenu from "../mainMenu/MainMenu";
import HeaderRightNav from "../headerRightNav/HeaderRightNav";

import "./header.scss";

const Header = () => {
	return (
		<div className="header">
			<MainMenu />
			<HeaderRightNav />
		</div>
	);
};

export default Header;
