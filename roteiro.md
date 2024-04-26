> Mostrar o banco de dados online na MongoDB

```bash
https://cloud.mongodb.com/v2/5e9b7502d29d1e3b5594e197#/clusters
```

```bash
mongodb+srv://root:gHzR6gQspEeLlTuD@cluster1.xncmw6r.mongodb.net/crud_mongoose
```

> Adicionar no .gitignore

```bash
.env

.serverless # Para ignorar a pasta gerada pelo serverless framework
```

---

> Adicionar o .env.example

```bash
# General Config
PORT=3085

# DataBase
DB_CONNECTION=""

# Config to RSA and JWT/JWE
PUBLIC_KEY=""
RSA_PRIVATE_KEY=""
SECRET_JWE=""

# AWS Credentials to deploy locally
AWS_ACCESS_KEY_ID="" # Adicionado essas duas envs da AWS para fazer deploy local
AWS_SECRET_ACCESS_KEY=""
```

---

> Mostrar as envs no secrets do github

```bash
https://github.com/LucasSantosDev/nodejs-mongoose/settings/secrets/actions
```

---

> Adicionar docker-compose.yaml

```bash
version: "3.8"

services:
  mongodb:
    image: mongo
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always

volumes:
  mongodb_data:
    driver: local
```

---

> Adicionar Links no README.md

```bash
> Article JWT/JWE etc: https://www.brunobrito.net.br/jose-jwt-jws-jwe-jwa-jwk-jwks/

> Generate Keys: https://keygen.io/

> JWT tools: https://jwt.io/

> Docs Mongoose: https://mongoosejs.com/docs/

> Cloud MongoDB Atlas: https://cloud.mongodb.com
```

---

> Adicionar os seguintes pacotes

```bash
yarn add -D serverless-offline # Adicionar para rodar local

yarn remove bcrypt body-parser nodemon # Remover o que não vai ser usado

yarn add bcryptjs serverless # Adicionar o serverless para fazer deploy local
```

---

> Mudar o import do bcrypt para o bcryptjs dentro dos arquivos utils/password.js e models/user.js

---

> Adicionar os seguintes comandos no package.json

```bash
"dev": "sls offline --region us-east-1 --stage dev",
```

---

> Adicionar o arquivo serverless.yaml

```bash
service: nodejs-mongoose

frameworkVersion: "3"

useDotenv: true

custom:
  generalName: 'nodejs-mongoose-${opt:stage, sls:stage, "dev"}'
  serverless-offline:
    ignoreJWTSignature: true
    httpPort: ${self:provider.environment.PORT}

provider:
  name: aws
  stackName: "${self:custom.generalName}-stack"
  runtime: nodejs16.x
  region: '${opt:region, sls:region, "us-east-1"}'
  stage: '${opt:stage, sls:stage, "dev"}'
  timeout: 30
  lambdaHashingVersion: 20201221
  environment:
    PUBLIC_KEY: ${env:PUBLIC_KEY}
    RSA_PRIVATE_KEY: ${env:RSA_PRIVATE_KEY}
    SECRET_JWE: ${env:SECRET_JWE}
    DB_CONNECTION: ${env:DB_CONNECTION}
    PORT: ${env:PORT}

plugins:
  - serverless-offline

functions:
  health-check:
    name: "${self:custom.generalName}-health-check"
    handler: src/functions/health-check.handler
    events:
      - http:
          path: health-check
          method: get

  list-users:
    name: "${self:custom.generalName}-users-list"
    handler: src/functions/users/list.handler
    timeout: 30
    events:
      - http:
          path: users
          method: get
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0

  custom-authorizer:
    handler: src/functions/authorizer.handler
```

---

> Criar a pasta .github/workflows e dentro o arquivo development.yaml

---

> Criar a pasta src/functions e dentro dela as seguintes pastas auth, reports e users

---

> Criar o arquivo utils/response.js

```bash
const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
};

const success = (body) => {
  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify(body),
  };
};

const created = (body) => {
  return {
    statusCode: 201,
    headers: defaultHeaders,
    body: JSON.stringify(body),
  };
};

const badRequest = (body) => {
  return {
    statusCode: 400,
    headers: defaultHeaders,
    body: JSON.stringify(body),
  };
};

module.exports = {
  success,
  created,
  badRequest,
};
```

---

> Criar dentro da pasta src/functions o arquivo health-check.js

```bash
"use strict";

const { success } = require("../utils/response");

module.exports.handler = async () => {
  return success({ message: "API is live" });
};
```

---

> Dentro do arquivo utils/jwt.js fazer as seguintes alterações

```bash
const expiresIn = 3600;

const validateToken = async (token) => {
    ...
    const decoded = await verify(token, publicKey, { algorithms: ["RS256"] });
}

const extractTokenFromHeader = (headers, headersFieldName) => {
  if (!headers[headersFieldName]) {
    throw new Error("Missing header basic authorization");
  }

  return headers[headersFieldName].replace("Basic ", "");
};

const generateJWT = async (payload) => {
    try {
        ...
    } catch (error) {
        console.error(error);
        ...
    }
}
```

---

> Criar o arquivo functions/authorizer.js

```bash
"use strict";

const { extractTokenFromHeader, validateToken } = require("../utils/jwt");

module.exports.handler = async (event, context, callback) => {
  try {
    const token = extractTokenFromHeader(event, "authorizationToken");

    const tokenValidate = await validateToken(token);

    if (tokenValidate?.data?._id) {
      const context = { userId: String(tokenValidate.data._id) };

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
        context,
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
      });
    }
  } catch (error) {
    console.error(error);

    callback("Unauthorized");
  }
};
```

---

> Adicionar o arquivo functions/users/list.js

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async () => {
  try {
    const users = await new UserService().getAllUsers();

    return success({ data: users });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

---

> Adicionar os seguintes comandos no package.json

```bash
"deploy:dev": "sls deploy --region us-east-1 --stage dev",
"deploy:function": "sls deploy --region us-east-1 --stage dev --function"
```

---

> Adicionar o arquivo .github/workflows/development.yaml para fazer o deploy pelo github

```bash
name: Deploy develop

on:
  workflow_dispatch:

jobs:
  Deploy:
    name: Process default to deploy
    runs-on: ubuntu-latest
    # if: ${{ github.ref == 'refs/heads/develop' }}

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Using nodejs
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install packages
        run: yarn install

      - name: Deploy serverless
        uses: serverless/github-action@v3.1
        with:
          args: deploy --stage dev --region us-east-1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          DB_CONNECTION: ${{ secrets.DB_CONNECTION }}
          PUBLIC_KEY: ${{ secrets.PUBLIC_KEY }}
          RSA_PRIVATE_KEY: ${{ secrets.RSA_PRIVATE_KEY }}
          SECRET_JWE: ${{ secrets.SECRET_JWE }}
          PORT: 3085
```

---

> Adicionar os detalhes do usuário e o login

```bash
  details-user:
    name: "${self:custom.generalName}-user-details"
    handler: src/functions/users/details.handler
    timeout: 30
    events:
      - http:
          path: users/{id}
          method: get
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0

  login:
    name: "${self:custom.generalName}-auth-login"
    handler: src/functions/auth/login.handler
    timeout: 30
    events:
      - http:
          path: auth/login
          method: post
          cors: true
```

---

> Adicionar os arquivos functions/users/details.js e functions/auth/login.js

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const user = await new UserService().getOneUser(event.pathParameters.id);

    return success({ data: user });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

```bash
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
```

---

> Adicionar o cadastro, alteração e deleção de usuário

```bash
  create-user:
    name: "${self:custom.generalName}-user-create"
    handler: src/functions/users/create.handler
    timeout: 30
    events:
      - http:
          path: users
          method: post
          cors: true
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0

  delete-user:
    name: "${self:custom.generalName}-user-delete"
    handler: src/functions/users/delete.handler
    timeout: 30
    events:
      - http:
          path: users/{id}
          method: delete
          cors: true
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0

  update-user:
    name: "${self:custom.generalName}-user-update"
    handler: src/functions/users/update.handler
    timeout: 30
    events:
      - http:
          path: users/{id}
          method: put
          cors: true
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0
```

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, created } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const newUser = await new UserService().createUser(JSON.parse(event.body));

    return created({ data: newUser });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { success, badRequest } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    await new UserService().deleteUser(event.pathParameters.id);

    return success({ message: "Registro excluido com sucesso" });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const updatedUser = await new UserService().updateUser(
      event.pathParameters.id,
      JSON.parse(event.body)
    );

    return success({ data: updatedUser });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

---

> Adicionar o perfil (functions/users/profile.js) e relatórios de usuários (functions/reports/users.js)

```bash
  profile-user:
    name: "${self:custom.generalName}-user-profile"
    handler: src/functions/users/profile.handler
    timeout: 30
    events:
      - http:
          path: users/profile
          method: get
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0

  report-users:
    name: "${self:custom.generalName}-report-users"
    handler: src/functions/reports/users.handler
    timeout: 30
    events:
      - http:
          path: reports/users
          method: get
          authorizer:
            name: custom-authorizer
            resultTtlInSeconds: 0
```

```bash
"use strict";

require("../../config/database");
const UserService = require("../../services/users");
const { generateJWT, encryptJWE } = require("../../utils/jwt");
const { badRequest, success } = require("../../utils/response");

module.exports.handler = async (event) => {
  try {
    const user = await new UserService().getOneUser(
      event.requestContext.authorizer.userId
    );

    const token = await generateJWT(user);

    const data = await encryptJWE(token);

    return success({ data });
  } catch (error) {
    console.error(error);

    return badRequest({ message: error.message });
  }
};
```

```bash
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
```