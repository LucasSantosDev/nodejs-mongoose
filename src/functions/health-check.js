"use strict";

const { success } = require("../utils/response");

module.exports.handler = async () => {
  return success({ message: "API is live" });
};
