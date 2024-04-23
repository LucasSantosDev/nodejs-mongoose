"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async () => {
  try {
    const users = await new UserService().getAllUsers();

    return success({ data: users });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
