const NodeRSA = require("node-rsa");

const key = new NodeRSA({ b: 2048 });

const publicKey = key.exportKey("public");
const privateKey = key.exportKey("private");

console.log("Chave pública:", publicKey);
console.log("Chave privada:", privateKey);
