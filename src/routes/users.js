const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

const userController = new UserController();

router.get("/profile", userController.profile);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getOneUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
