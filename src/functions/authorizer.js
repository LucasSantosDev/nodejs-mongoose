"use strict";

const { extractTokenFromHeader, validateToken } = require("../utils/jwt");

module.exports.handler = async (event) => {
  try {
    const token = extractTokenFromHeader(event, "authorizationToken");

    const tokenValidate = await validateToken(token);

    if (tokenValidate?.data?._id) {
      const context = { userId: String(tokenValidate.data._id) };

      return { isAuthorized: true, context };
    } else {
      console.log("Deny >> ", event);

      return { isAuthorized: false };
    }
  } catch (error) {
    console.error(error);

    return { isAuthorized: false };
  }
};
