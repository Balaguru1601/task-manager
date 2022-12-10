const Task = require("../Models/Task");
const User = require("../Models/User");
const ExpressError = require("../Utilities/ExpressError");

module.exports.getTasks = async (req, res, next) => {
	const { userId } = req.params;
	const user = await User.findById(userId);
	if (!user)
		return res.status(404).json({
			message: "User not found",
		});

	const tasks = await Task.find({ user_id: userId });
	return res.status(200).json({
		tasks: tasks,
		message: "Task fetch successfull",
	});
};

module.exports.addTask = async (req, res, next) => {
	const { task, userId } = req.body;
	const user = await User.findById(userId);
	if (!user)
		return res.status(404).json({
			message: "User not found",
		});
	const addTask = new Task({
		title: task.title,
		description: task.description,
		deadline: task.deadline,
		user_id: userId,
		done: task.done,
	});

	await addTask.save();
	const tasks = await Task.find({ user_id: userId });
	return res.status(200).json({
		message: "Task added successfully",
		tasks: tasks,
	});
};

module.exports.updateTask = async (req, res, next) => {
	const { task, userId } = req.body;
	const user = await User.findById(userId);
	if (!user)
		return res.status(404).json({
			message: "User not found",
		});
	await Task.findByIdAndUpdate(task._id, {
		title: task.title,
		description: task.description,
		deadline: task.deadline,
		done: task.done,
	});
	const tasks = await Task.find({ user_id: userId });
	return res.status(200).json({
		tasks: tasks,
		message: "Task updated successfully",
	});
};

module.exports.deleteTask = async (req, res, next) => {
	const { userId, task } = req.body;
	const user = await User.findById(userId);
	if (!user)
		return res.status(404).json({
			message: "User not found",
		});
	await Task.findByIdAndDelete(task._id);
	const tasks = await Task.find({ user_id: userId });
	return res.status(200).json({
		message: "Task deleted successfully",
		tasks: tasks,
	});
};
