"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async () => {
  try {
    const users = await new UserService().getAllUsers();

    return success({ data: users });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
