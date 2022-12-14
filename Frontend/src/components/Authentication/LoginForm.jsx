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
	validatePassword,
	validateText,
} from "../../Utilities/FormValidationFunctions";
import useInput from "../../Hooks/use-input";
import CustomFormControl from "../UI/Forms/CustomFormControl";
import axios from "axios";
import Error from "../UI/Typography/Error";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthStore";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = (props) => {
	const dispatch = useDispatch();
	const userField = useInput(
		{ type: "text", label: "Username", name: "username" },
		validateText
	);
	const passwordField = useInput(
		{
			type: "password",
			label: "Password",
			name: "password",
		},
		validatePassword
	);

	const formIsValid =
		userField.validities.isValid && passwordField.validities.isValid;

	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState(null);

	const handleClickShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleMouseDownPassword = (event) => event.preventDefault();

	const loginUser = async (event) => {
		try {
			event.preventDefault();
			const response = await axios.post(backendUrl + "/user/login", {
				username: userField.properties.value,
				password: passwordField.properties.value,
			});
			const user = response.data.user;
			dispatch(authActions.loginHandler({ user: user }));
			userField.validities.reset();
			passwordField.validities.reset();
			props.setSnack({
				open: true,
				message: response.data.message,
				severity: "success",
			});
		} catch (error) {
			setLoginError(error.response.data.message);
		}
	};

	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.cardMedia}
				component="img"
				image="/assets/signUp.gif"
				alt="green iguana"
			/>
			<CardContent>
				{loginError && <Error message={loginError} />}
				<form id="login-form">
					<CustomFormControl
						field={userField}
						IconBtnProps={{ disabled: true }}
						icon="AccountCircle"
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
					onClick={loginUser}
					disabled={!formIsValid}
					type="submit"
					form="login-form"
				>
					Login
				</Button>
				<Button
					variant="contained"
					fullWidth
					onClick={props.viewSignUpForm}
					sx={{
						ml: "0 !important",
						mt: 1,
					}}
				>
					Not a member? Signup
				</Button>
			</CardActions>
		</Card>
	);
};

export default LoginForm;
