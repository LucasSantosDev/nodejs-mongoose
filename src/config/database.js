const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECTION, {});

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Erro de conexão com o banco de dados")
);

db.once("open", function () {
  console.log("Conectado ao banco de dados");
});

module.exports = db;
