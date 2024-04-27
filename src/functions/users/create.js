"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { mapUserAuth } = require("../../utils/mappers");
const { created, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const newUser = await new UserService().createUser(JSON.parse(event.body));

    return created({ data: mapUserAuth(newUser) });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
