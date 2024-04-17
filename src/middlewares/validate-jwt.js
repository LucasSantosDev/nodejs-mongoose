const { validateToken, extractTokenFromHeader } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers);

    const tokenValidate = validateToken(token);

    console.log(tokenValidate.data?._id);

    next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
