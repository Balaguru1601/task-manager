import * as Icon from "@mui/icons-material";
import classes from "./CustomFormControl.module.css";
import {
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormControl,
	FormHelperText,
	TextField,
} from "@mui/material";

const CustomFormControl = (props) => {
	const { field } = props;
	const InputIcon = Icon[props.icon];

	return (
		<FormControl
			className={classes.formControl}
			error={field.validities.isInvalid}
			color={field.validities.isValid ? "success" : "error"}
		>
			<InputLabel htmlFor={field.properties.id}>
				{field.validities.label}
			</InputLabel>
			<OutlinedInput
				sx={{
					marginRight: "1rem",
					width: "100%",
					backgroundColor: "white",
				}}
				{...field.properties}
				endAdornment={
					props.icon ? (
						<InputAdornment position="end">
							<IconButton {...props.IconBtnProps}>
								<InputIcon />
							</IconButton>
						</InputAdornment>
					) : (
						""
					)
				}
				type={props.type ? props.type : field.properties.type}
			/>
			{field.validities.isInvalid && (
				<FormHelperText id="component-error-text">
					{field.validities.message}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default CustomFormControl;
