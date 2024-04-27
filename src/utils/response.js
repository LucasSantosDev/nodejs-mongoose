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
