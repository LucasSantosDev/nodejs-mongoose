"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, created } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const newUser = await new UserService().createUser(JSON.parse(event.body));

    return created({ data: newUser });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
