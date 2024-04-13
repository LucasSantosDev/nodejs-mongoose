const UserService = require("../services/users");

const userService = new UserService();

module.exports = class UserController {
  async createUser(req, res) {
    try {
      const newUser = await userService.createUser(req.body);

      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getAllUsers(_, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getOneUser(req, res) {
    try {
      const user = await userService.getOneUser(req.params.id);

      res.status(200).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);

      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);

      res.status(200).send({
        message: "Registro excluido com sucesso",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getReport(req, res) {
    try {
      const report = await userService.getReport(req.query);

      res.status(200).send(report);
    } catch (error) {
      res.status(400).send(error);
    }
  }
};
