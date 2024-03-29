import classes from "./Authentication.module.css";
import {
	Card,
	CardMedia,
	CardContent,
	Button,
	CardActions,
} from "@mui/material";
import { useState } from "react";
import {
	validateEmail,
	validatePassword,
	validateUserName,
} from "../../Utilities/FormValidationFunctions";
import useInput from "../../Hooks/use-input";
import CustomFormControl from "../UI/Forms/CustomFormControl";
import axios from "axios";
import Error from "../UI/Typography/Error";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthStore";
import CustomLoader from "../UI/CustomLoader";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignUpForm = (props) => {
	const dispatch = useDispatch();
	const userField = useInput(
		{ type: "text", label: "Username", name: "username" },
		validateUserName
	);
	const passwordField = useInput(
		{
			type: "password",
			label: "Password",
			name: "password",
		},
		validatePassword
	);
	const emailField = useInput(
		{
			type: "email",
			label: "Email Id",
			name: "emailId",
		},
		validateEmail
	);
	const [showPassword, setShowPassword] = useState(false);
	const [registrationError, setRegistrationerror] = useState(null);
	const [loading, setLoading] = useState(false);

	const formIsValid =
		userField.validities.isValid &&
		emailField.validities.isValid &&
		passwordField.validities.isValid;

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleMouseDownPassword = (event) => event.preventDefault();

	const registerUser = async () => {
		try {
			setLoading(true);
			const response = await axios.post(backendUrl + "/user/register", {
				username: userField.properties.value,
				email: emailField.properties.value,
				password: passwordField.properties.value,
			});
			const user = response.data.user;
			dispatch(authActions.loginHandler({ user: user }));
			userField.validities.reset();
			emailField.validities.reset();
			passwordField.validities.reset();
			props.setSnack({
				open: true,
				message: response.data.message,
				severity: "success",
			});
		} catch (error) {
			setRegistrationerror(error.response.data.message);
		}
		setLoading(false);
	};

	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.cardMedia}
				component="img"
				image="/assets/signUp.gif"
				alt="Login.gif"
			/>
			<CardContent>
				{registrationError && <Error message={registrationError} />}
				<form id="signUp-Form">
					<CustomFormControl
						field={userField}
						IconBtnProps={{ disabled: true }}
						icon="AccountCircle"
					/>
					<CustomFormControl
						field={emailField}
						IconBtnProps={{ disabled: true }}
						icon="Email"
					/>
					<CustomFormControl
						field={passwordField}
						IconBtnProps={{
							onClick: handleClickShowPassword,
							onMouseDown: handleMouseDownPassword,
							disabled:
								passwordField.properties.value.length === 0,
						}}
						icon={showPassword ? "VisibilityOff" : "Visibility"}
						type={showPassword ? "text" : "password"}
					/>
				</form>
			</CardContent>
			<CardActions
				sx={{
					justifyContent: "space-evenly",
					flexWrap: "wrap",
				}}
			>
				<Button
					variant="contained"
					fullWidth
					onClick={registerUser}
					disabled={!formIsValid}
				>
					Sign Up
				</Button>
				<Button
					variant="contained"
					fullWidth
					onClick={props.viewLoginForm}
					sx={{
						ml: "0 !important",
						mt: 1,
					}}
				>
					Already a member? Login
				</Button>
			</CardActions>
			{loading && <CustomLoader />}
		</Card>
	);
};

export default SignUpForm;
