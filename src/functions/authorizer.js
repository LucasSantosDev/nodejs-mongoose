"use strict";

const { extractTokenFromHeader, validateToken } = require("../utils/jwt");

module.exports.handler = async (event, context, callback) => {
  try {
    const token = extractTokenFromHeader(event, "authorizationToken");

    const tokenValidate = validateToken(token);

    if (tokenValidate?.data?._id) {
      const contextData = { userId: String(tokenValidate.data._id) };

      callback(null, {
        principalId: "user",
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: event.methodArn,
            },
          ],
        },
        context: contextData,
      });
    } else {
      callback(null, {
        principalId: "user",
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Deny",
              Resource: event.methodArn,
            },
          ],
        },
        context: contextData,
      });
    }
  } catch (error) {
    console.error(error);

    callback("Unauthorized");
  }
};
