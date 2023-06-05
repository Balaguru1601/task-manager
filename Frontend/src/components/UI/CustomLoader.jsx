import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Fragment } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./Backdrop";

const Loader = () => {
	return (
		<Box
			sx={{
				top: "50%",
				left: "50%",
				position: "absolute",
				transform: "translate(-50%,-50%)",
				zIndex: 100,
			}}
		>
			<CircularProgress size={"5rem"} />
		</Box>
	);
};

const CustomLoader = () => {
	return (
		<Fragment>
			{createPortal(
				<Backdrop />,
				document.getElementById("backdrop-root")
			)}
			{createPortal(<Loader />, document.getElementById("overlay-root"))}
		</Fragment>
	);
};

export default CustomLoader;
