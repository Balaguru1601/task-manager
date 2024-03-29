import { Add } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomSnackbar from "../UI/CustomSnackbar";
import Task from "./Task";
import TaskForm from "./TaskForm";
import classes from "./Tasks.module.css";
import CustomLoader from "../UI/CustomLoader";

const backendUrl = import.meta.env.VITE_BACKEND_URL + "/tasks";

const AllTasks = () => {
	const [addTask, setAddTask] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const userId = useSelector((state) => state.auth.userId);

	const updateTasks = (data) => setTasks(data);

	const updateAddStatus = (data) => setAddTask(data);

	const taskAdder = () => {
		setAddTask((prev) => true);
	};

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

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			const response = await axios.get(backendUrl + "/all/" + userId);
			if (response.status !== 200) {
				setSnackState({
					open: true,
					message: response.data.message,
					severity: "error",
				});
				setLoading(false);
				return;
			}
			setTasks(response.data.tasks);
			response.data.tasks.length > 0 &&
				setSnackState({
					open: true,
					message: response.data.message,
					severity: "success",
				});
			setLoading(false);
		};

		getData();
	}, []);

	return (
		<Box
			sx={{
				mt: 6,
				maxWidth: 1280,
				mx: "auto",
			}}
		>
			{tasks.length > 0 &&
				tasks.map((task, index) => (
					<Task key={index} task={task} setTasks={updateTasks} />
				))}
			{!addTask && (
				<Tooltip title="Add Task" placement="right">
					<IconButton
						onClick={taskAdder}
						size="large"
						sx={{
							border: "1px solid white",
							mt: 4,
						}}
					>
						<Add sx={{ color: "white", fontWeight: 700 }} />
					</IconButton>
				</Tooltip>
			)}
			{addTask && (
				<TaskForm
					type="new"
					setTasks={updateTasks}
					setAddTask={updateAddStatus}
				/>
			)}
			<CustomSnackbar handleClose={handleClick} {...snackState} />
			{loading && <CustomLoader />}
		</Box>
	);
};

export default AllTasks;
