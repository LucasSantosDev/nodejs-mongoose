const { extractTokenFromHeader, validateToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers, "authorization");

    const tokenValidate = validateToken(token);

    if (!tokenValidate.data?._id) {
      throw new Error("Error to validate JWT");
    }

    req.headers.userId = tokenValidate.data._id;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).send({ message: "Not allowed" });
  }
};
