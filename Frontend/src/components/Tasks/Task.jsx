import {
	IconButton,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";
import classes from "./Tasks.module.css";
import { Edit, Delete, Done } from "@mui/icons-material";
import TaskForm from "./TaskForm";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import CustomSnackbar from "../UI/CustomSnackbar";
import moment from "moment";
import CustomLoader from "../UI/CustomLoader";

const backendUrl = import.meta.env.VITE_BACKEND_URL + "/tasks";

const Task = (props) => {
	const [viewType, setViewType] = useState("normal");
	const [loading, setLoading] = useState(false);
	const task = props.task;
	const setTasks = props.setTasks;
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

	const deleteTask = async () => {
		setLoading(true);
		const response = await axios.post(backendUrl + "/delete", {
			task,
			userId,
		});
		setLoading(false);
		if (response.status !== 200)
			return setSnackState({
				open: true,
				message: response.data.message,
				severity: "error",
			});
		props.setTasks(response.data.tasks);
		return setSnackState({
			open: true,
			message: response.data.message,
			severity: "success",
		});
	};

	const editTask = () => {
		setViewType("edit");
	};

	const setToNormal = () => {
		setViewType("normal");
	};

	const date = moment(task.deadline).date();
	const month = moment(task.deadline).format("MMM");

	const markAsComplete = async () => {
		setLoading(true);
		const response = await axios.post(backendUrl + "/update", {
			task: {
				...task,
				done: true,
			},
			userId,
		});
		setLoading(false);
		if (response.status !== 200)
			return setSnackState({
				open: true,
				message: response.data.message,
				severity: "error",
			});
		props.setTasks(response.data.tasks);
		return setSnackState({
			open: true,
			message: "Marked as done",
			severity: "success",
		});
	};

	const expired =
		moment().format("YYYY-MM-DD") >
		moment(task.deadline).format("YYYY-MM-DD");

	const completed = task.done;

	const borderColor = completed ? "#BCEAD5" : expired ? "#FF7D7D" : "";

	return (
		<Paper sx={{ flexGrow: 1, my: 2, overflow: "hidden" }} elevation={3}>
			{viewType === "normal" && (
				<Grid
					container
					spacing={2}
					m={0}
					sx={{
						backgroundColor: borderColor,
					}}
				>
					<Grid
						xs={4}
						alignSelf="center"
						sx={{ borderRight: "2px dashed grey" }}
					>
						<Box
							sx={{
								width: "70%",
								mx: "auto",
							}}
						>
							<Typography variant="h2" gutterBottom>
								{date}
							</Typography>
							<Typography variant="h4">{month}</Typography>
						</Box>
					</Grid>
					<Grid xs={8}>
						<Typography variant="h4" gutterBottom>
							{task.title}
						</Typography>
						<Typography variant="body1" gutterBottom px={2}>
							{task.description}
						</Typography>
						<Box>
							{!completed && (
								<Tooltip title="Edit task">
									<IconButton onClick={editTask}>
										<Edit />
									</IconButton>
								</Tooltip>
							)}
							<Tooltip title="Delete task">
								<IconButton onClick={deleteTask}>
									<Delete />
								</IconButton>
							</Tooltip>
							{!completed && (
								<Tooltip title="Mark as done">
									<IconButton onClick={markAsComplete}>
										<Done />
									</IconButton>
								</Tooltip>
							)}
						</Box>
					</Grid>
					<CustomSnackbar handleClose={handleClick} {...snackState} />
				</Grid>
			)}
			{viewType === "edit" && (
				<TaskForm
					type="edit"
					task={task}
					setTasks={setTasks}
					setToNormal={setToNormal}
				/>
			)}
			{loading && <CustomLoader />}
		</Paper>
	);
};

export default Task;
