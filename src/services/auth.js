const User = require("../models/user");
const { verifyPassword } = require("../utils/password");

module.exports = class AuthService {
  async login({ email, password }) {
    const user = await User.findOne({ email });

    if (!user?._id || !(await verifyPassword(password, user.password))) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }
};
