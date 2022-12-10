import { Typography } from "@mui/material";

const Error = (props) => {
	return (
		<Typography variant="body2" color="error" textAlign="center">
			{props.message}
		</Typography>
	);
};

export default Error;
