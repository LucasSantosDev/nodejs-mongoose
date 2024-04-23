"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const updatedUser = await new UserService().updateUser(
      event.pathParameters.id,
      JSON.parse(event.body)
    );

    return success({ data: updatedUser });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
