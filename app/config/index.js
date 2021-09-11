const config = {
  database: {
    connection: "postgres://postgres:123456@localhost/commerce",
  },
  api: {
    host: "127.0.0.1",
    port: 3000,
  },
  jwt: {
    secretKey: "secretKey123",
  },
  sendgrid: {
    secretKey: null,
    fromEmail: null,
  },
  webClient: {
    url: "http://localhost:3000",
  },
};

module.exports = config;
