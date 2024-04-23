"use strict";

require("../../config/database");
const AuthService = require("../../services/auth");
const { generateJWT } = require("../../utils/jwt");
const { mapUserAuth } = require("../../utils/mappers");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await new AuthService().login({ email, password });

    const token = await generateJWT(mapUserAuth(user));

    return success({ token });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
