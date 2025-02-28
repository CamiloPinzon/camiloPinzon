import "./spinner.scss";

const Spinner = () => {
	return (
		<>
			<div className="spinner">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
            </div>
            <p className="loading">Loading...</p>
		</>
	);
};

export default Spinner;
