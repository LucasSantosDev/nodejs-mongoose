const AuthService = require("../services/auth");
const { generateJWT, encryptJWE } = require("../utils/jwt");

const authService = new AuthService();

module.exports = class AuthController {
  async login(req, res) {
    try {
      const user = await authService.login(req.body);

      const token = await generateJWT(user);

      const data = await encryptJWE(token);

      res.status(200).send({ token, data });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
};
