"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { mapUserAuth } = require("../../utils/mappers");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const updatedUser = await new UserService().updateUser(
      event.pathParameters.id,
      JSON.parse(event.body)
    );

    return success({ data: mapUserAuth(updatedUser) });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
