"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const report = await new UserService().getReport(
      event.queryStringParameters
    );

    return success({ data: report });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
