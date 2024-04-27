const bcrypt = require("bcryptjs");

const verifyPassword = async (passwordReq, passwordDB) => {
  try {
    return bcrypt.compare(passwordReq, passwordDB);
  } catch (error) {
    console.error("Erro ao verificar a senha: ", error);

    return false;
  }
};

module.exports = {
  verifyPassword,
};
