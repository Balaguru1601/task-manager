const router = require("express").Router();
const tasks = require("../Controllers/Task");
const CatchAsync = require("../Utilities/CatchAsync");

router.get("/all/:userId", CatchAsync(tasks.getTasks));

router.post("/update", CatchAsync(tasks.updateTask));

router.post("/add", CatchAsync(tasks.addTask));

router.post("/delete", CatchAsync(tasks.deleteTask));

module.exports = router;
