const AuthService = require("../services/auth");
const { generateJWT } = require("../utils/jwt");
const { mapUserAuth } = require("../utils/mappers");

const authService = new AuthService();

module.exports = class AuthController {
  async login(req, res) {
    try {
      const user = await authService.login(req.body);

      const token = await generateJWT(mapUserAuth(user));

      res.status(200).send({ token });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
};
