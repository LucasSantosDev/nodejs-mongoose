const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./config/database");
const userRoutes = require("./routes/users");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const validateJwt = require("./middlewares/validate-jwt");

const port = 3086; // process.env.PORT;

const app = express();

app.use(express.json());

app.use("/users", validateJwt, userRoutes);
app.use("/report", validateJwt, reportRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
