import { Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import useInput from "../../Hooks/use-input";
import {
	validateDate,
	validateText,
} from "../../Utilities/FormValidationFunctions";
import CustomFormControl from "../UI/Forms/CustomFormControl";
import Error from "../UI/Typography/Error";
import classes from "./Tasks.module.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const TaskForm = (props) => {
	const userId = useSelector((state) => state.auth.userId);
	const [error, setError] = useState(null);
	const task = props.task;

	const titleField = useInput(
		{
			type: "text",
			name: "title",
			label: "Title",
			initialValue: props.type === "edit" ? task.title : "",
		},
		validateText
	);

	const descriptionField = useInput(
		{
			type: "text",
			name: "description",
			label: "Description",
			initialValue: props.type === "edit" ? task.description : "",
		},
		validateText
	);

	const deadlineField = useInput(
		{
			type: "date",
			name: "deadline",
			label: "Deadline",
			initialValue:
				props.type === "edit"
					? moment(task.deadline).format("YYYY-MM-DD")
					: moment().format("YYYY-MM-DD"),
		},
		validateDate
	);

	let formIsValid =
		titleField.validities.isValid &&
		descriptionField.validities.isValid &&
		deadlineField.validities.isValid;

	const newTask = {
		title: titleField.properties.value,
		description: descriptionField.properties.value,
		deadline: deadlineField.properties.value,
		done: false,
	};

	props.type === "edit" ? (newTask._id = task._id) : null;

	const formSubmitHandler = async (event) => {
		event.preventDefault();
		if (!formIsValid) {
			titleField.properties.onBlur();
			descriptionField.properties.onBlur();
			deadlineField.properties.onBlur();
			return;
		}

		const url =
			props.type === "new"
				? backendUrl + "/tasks/add"
				: backendUrl + "/tasks/update";

		const response = await axios.post(url, {
			task: newTask,
			userId,
		});
		if (response.status !== 200) return setError(response.data.message);
		props.setTasks(response.data.tasks);
		if (props.type === "new") return props.setAddTask(false);
		return props.setToNormal("normal");
	};

	return (
		<Box
			sx={{
				padding: 2,
				backgroundColor: "white",
			}}
		>
			{error && <Error>{error}</Error>}
			<form onSubmit={formSubmitHandler} className={classes.form}>
				<CustomFormControl field={titleField} />
				<CustomFormControl field={descriptionField} />
				<CustomFormControl field={deadlineField} />
				<Button type="submit" variant="outlined">
					Add
				</Button>
			</form>
		</Box>
	);
};

export default TaskForm;
