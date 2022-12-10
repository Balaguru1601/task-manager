import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Alert } from "@mui/material";
import { createPortal } from "react-dom";

const CustomSnackbar = (props) => {
	const handleClose = () => {
		props.handleClose(false);
	};
	const action = (
		<IconButton
			size="small"
			aria-label="close"
			color="inherit"
			onClick={handleClose}
		>
			<CloseIcon fontSize="small" />
		</IconButton>
	);

	const Snack = (
		<Snackbar
			open={props.open}
			autoHideDuration={4000}
			onClose={handleClose}
			action={action}
		>
			<Alert
				onClose={handleClose}
				severity={props.severity}
				sx={{ width: "100%" }}
			>
				{props.message}
			</Alert>
		</Snackbar>
	);
	return (
		<>
			{createPortal(
				<Snackbar
					open={props.open}
					autoHideDuration={4000}
					onClose={handleClose}
					action={action}
				>
					<Alert
						onClose={handleClose}
						severity={props.severity}
						sx={{ width: "100%" }}
					>
						{props.message}
					</Alert>
				</Snackbar>,
				document.getElementById("root")
			)}
		</>
	);
};

export default CustomSnackbar;
