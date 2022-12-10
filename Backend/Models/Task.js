const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	deadline: {
		type: Date,
		required: true,
	},
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	done: {
		type: Boolean,
		required: true,
	},
});

module.exports = mongoose.model("Task", TaskSchema);
