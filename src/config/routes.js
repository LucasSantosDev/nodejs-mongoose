const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

const userController = new UserController();

const userRouter = express.Router();
userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getOneUser);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
router.use("/users", userRouter);

const reportRouter = express.Router();
reportRouter.get("/users", userController.getReport);
router.use("/report", reportRouter);

module.exports = router;
