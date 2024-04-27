## CRUD Mongoose

> Docs Mongoose: https://mongoosejs.com/docs/

### Lista usuários

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3084/users
```

### Criar um usuário

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Lucas Santos","email":"lucas.santo@example.com","age":30}' http://localhost:3084/users
```

### Detalhes usuário

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3084/users/661a88a34f5a515e800b4231
```

### Atualizar um usuário

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name": "Lucas Santos","email":"lucas.santo@example.com","age":80}' http://localhost:3084/users/661a88a34f5a515e800b4231
```

### Remover usuário

```bash
curl -X DELETE -H "Content-Type: application/json" http://localhost:3084/users/661a88a34f5a515e800b4231
```

### Run mongodb container

```bash
sudo docker-compose up -d
```

## Links

> Article JWT/JWE etc: https://www.brunobrito.net.br/jose-jwt-jws-jwe-jwa-jwk-jwks/

> Generate Keys: https://keygen.io/

> JWT tools: https://jwt.io/

> Docs Mongoose: https://mongoosejs.com/docs/

> Cloud MongoDB Atlas: https://cloud.mongodb.com