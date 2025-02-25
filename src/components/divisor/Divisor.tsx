import "./divisor.scss";

type DivisorT = {
	theme?: string;
};

const Divisor = ({ theme = "dark" }: DivisorT) => {
	return <div className={`divisor ${theme}`}></div>;
};

export default Divisor;
