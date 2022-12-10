const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

const ExpressError = require("./Utilities/ExpressError");
const userRoutes = require("./Routes/User");
const taskRoutes = require("./Routes/Task");
require("dotenv").config();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db_url = process.env.DB_URL;

const sessionConfig = {
	name: "session",
	secret: "secret",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

mongoose
	.connect(db_url || "mongodb://localhost:27017/assignment")
	.then(() => {
		console.log("MONGO CONNECTION OPEN!!!");
	})
	.catch((err) => {
		console.log("OH NO MONGO ERROR!!!!");
		console.log(err);
	});

app.use(session(sessionConfig));

app.use("/user", userRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res, next) => {
	res.send("hello there!");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = "Oh No,Something Went Wrong!";
	return res.status(status).json({ message: err.message });
});

app.listen(5000, () => {
	console.log("Server running at 5000");
});
