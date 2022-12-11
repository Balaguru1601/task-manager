import { useEffect, useState } from "react";
import SignUpForm from "../Authentication/SignUpForm";
import classes from "./Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "../Authentication/LoginForm";
import { authActions, verifyToken } from "../../store/AuthStore";
import { Button, Snackbar } from "@mui/material";
import CustomSnackbar from "../UI/CustomSnackbar";
import axios from "axios";
import AllTasks from "../Tasks/AllTasks";

let initial = true;

const backendUrl = import.meta.env.VITE_BACKEND_URL + "/user";

const Home = () => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const userId = useSelector((state) => state.auth.userId);
	const [snackState, setSnackState] = useState({
		open: false,
		message: null,
		severity: "success",
	});

	const handleClick = () => {
		setSnackState((prev) => ({
			open: false,
			message: null,
			severity: "success",
		}));
	};

	const setSnack = (data) => {
		setSnackState((prev) => ({ ...data }));
	};

	useEffect(() => {
		if (initial) {
			dispatch(verifyToken());
			initial = false;
		}
	}, [dispatch, isLoggedIn]);

	const [content, setContent] = useState(0);

	const viewLoginForm = () => {
		setContent(1);
	};

	const viewSignUpForm = () => {
		setContent(0);
	};

	const logoutUser = () => {
		dispatch(authActions.logoutHandler());
		return setSnackState((prev) => ({
			open: true,
			message: "Logged out successfully",
			severity: "success",
		}));
	};

	const deleteUser = async () => {
		try {
			dispatch(authActions.deleteUser());
			const response = await axios.post(backendUrl + "/delete", {
				userId,
			});
			return setSnackState((prev) => ({
				open: true,
				message: response.data.message,
				severity: "success",
			}));
		} catch (error) {
			return setSnackState((prev) => ({
				open: true,
				message: error.message,
				severity: "error",
			}));
		}
	};

	return (
		<div>
			{!isLoggedIn && content === 0 && (
				<SignUpForm viewLoginForm={viewLoginForm} setSnack={setSnack} />
			)}
			{!isLoggedIn && content === 1 && (
				<LoginForm
					viewSignUpForm={viewSignUpForm}
					setSnack={setSnack}
				/>
			)}
			{isLoggedIn && (
				<div>
					<Button onClick={logoutUser}>Logout</Button>
					<Button onClick={deleteUser}>Delete account</Button>
					<AllTasks />
				</div>
			)}
			<CustomSnackbar handleClose={handleClick} {...snackState} />
		</div>
	);
};

export default Home;
