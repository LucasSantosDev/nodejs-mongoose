"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    await new UserService().deleteUser(event.pathParameters.id);

    return success({ message: "Registro excluido com sucesso" });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
