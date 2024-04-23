"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { generateJWT, encryptJWE } = require("../../utils/jwt");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const user = await new UserService().getOneUser(
      event.requestContext.authorizer.userId
    );

    const token = await generateJWT(user);

    const data = await encryptJWE(token);

    return success({ data });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
