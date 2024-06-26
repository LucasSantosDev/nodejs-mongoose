"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { mapUserAuth } = require("../../utils/mappers");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const user = await new UserService().getOneUser(event.pathParameters.id);

    return success({ data: user ? mapUserAuth(user) : {} });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
