const express = require("express");
const dotenv = require("dotenv");
const routes = require("./config/routes");
dotenv.config();
require("./config/database");

const port = 3084;

const app = express();

app.use(express.json());

app.use(routes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
