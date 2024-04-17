const { sign, verify } = require("jsonwebtoken");
const { JWK, JWE } = require("node-jose");

const expiresIn = 3000;

const extractTokenFromHeader = (headers) => {
  if (
    headers.authorization &&
    headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return headers.authorization.split(" ")[1];
  } else {
    return headers.authorization;
  }
};

const validateToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token de autorização não fornecido");
    }

    const publicKey = process.env.PUBLIC_KEY;

    const decoded = verify(token, publicKey, { algorithms: ["RS256"] });

    console.log("Token JWT decodificado:", decoded);

    return decoded;
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao validar acesso");
  }
};

const generateJWT = async (payload) => {
  try {
    const privateKey = process.env.RSA_PRIVATE_KEY;

    const token = sign({ data: payload }, privateKey, {
      algorithm: "RS256",
      expiresIn,
    });

    console.log("Token JWT assinado:", token);

    return token;
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao gerar autenticação");
  }
};

const encryptJWE = async (tokenJWT) => {
  const keyData = Buffer.from(process.env.SECRET_JWE, "hex");
  const key = await JWK.asKey({ k: keyData, kty: "oct" });
  const jwe = await JWE.createEncrypt(
    { format: "compact", fields: { cty: "JWT" } },
    key
  )
    .update(tokenJWT)
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
  expiresIn,
  validateToken,
  extractTokenFromHeader,
  generateJWT,
  encryptJWE,
  decryptJWE,
};
