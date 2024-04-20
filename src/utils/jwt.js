const { sign, verify } = require("jsonwebtoken");
const { JWK, JWE } = require("node-jose");

const expiresIn = 3000;

const validateToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token authorization missing");
    }

    const publicKey = process.env.PUBLIC_KEY;

    const decoded = verify(token, publicKey, { algorithms: ["RS256"] });

    return decoded;
  } catch (error) {
    console.error(error);

    throw new Error("Error to validate token");
  }
};

const extractTokenFromHeader = (headers) => {
  if (
    headers.authorization &&
    headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return headers.authorization.split(" ")[1];
  }

  return headers.authorization;
};

const generateJWT = async (payload) => {
  try {
    const privateKey = process.env.RSA_PRIVATE_KEY;

    const token = sign({ data: payload }, privateKey, {
      algorithm: "RS256",
      expiresIn,
    });

    return token;
  } catch (error) {
    console.error("Erro ao gerar autenticação");

    throw new Error("Error to generate JWT");
  }
};

const encryptJWE = async (token) => {
  const keyData = Buffer.from(process.env.SECRET_JWE, "hex");
  const key = await JWK.asKey({ k: keyData, kty: "oct" });
  const jwe = await JWE.createEncrypt(
    {
      format: "compact",
      fields: { cty: "JWT" },
    },
    key
  )
    .update(token)
    .final();

  return jwe;
};

const decryptJWE = async (encrypted) => {
  const keyData = Buffer.from(process.env.SECRET_JWE, "hex");
  const key = await JWK.asKey({ k: keyData, kty: "oct" });
  const decrypted = await JWE.createDecrypt(key).decrypt(encrypted);

  return verify(decrypted.plaintext.toString(), process.env.PUBLIC_KEY);
};

module.exports = {
  generateJWT,
  extractTokenFromHeader,
  validateToken,
  encryptJWE,
  decryptJWE,
};
