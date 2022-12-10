const router = require("express").Router();
const users = require("../Controllers/Users");
const CatchAsync = require("../Utilities/CatchAsync");

router.route("/register").post(CatchAsync(users.registerUser));

router.route("/login").post(CatchAsync(users.loginUser));

router.route("/verify").post(CatchAsync(users.verifyUser));

router.get("/logout", users.logoutUser);

router.post("/delete", users.deleteUser);

module.exports = router;
