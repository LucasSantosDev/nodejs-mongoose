const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const AuthController = require("../controllers/auth");
const validateJwt = require("../middlewares/validate-jwt");

const userController = new UserController();
const authController = new AuthController();

const userRouter = express.Router();
userRouter.get("/", userController.getAllUsers);
userRouter.get("/:id", userController.getOneUser);
userRouter.post("/", userController.createUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);
router.use("/users", validateJwt, userRouter);

const reportRouter = express.Router();
reportRouter.get("/users", userController.getReport);
router.use("/report", reportRouter);

const authRouter = express.Router();
authRouter.post("/login", authController.login);
router.use("/auth", authRouter);

module.exports = router;
