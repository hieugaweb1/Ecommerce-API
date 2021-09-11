'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const hapiAuthJWT = require('hapi-auth-jwt2');
const routes = require('./main/routes');
const config = require('./config')
require('dotenv').config();

const server = new Hapi.Server({
  host: config.api.host,
  port: config.api.port,
  routes: {
    cors: {
      origin: ['*'],
      headers: ['Access-Control-Allow-Headers', 'Authorization', 'Content-Type'],
      credentials: true
    }
  }
});

const validateUser = (decoded, request) => {
  if (decoded && decoded.id) {
    return {
      isValid: true
    };
  }

  return {
    isValid: false
  };
};

const apiVersionOptions = {
  basePath: '/api/v1/',
  validVersions: [1, 2],
  defaultVersion: 1,
  vendorName: 'api/v1/'
};

const swaggerOptions = {
  pathPrefixSize: 3,
  host: config.api.host,
  basePath: apiVersionOptions.basePath,
  info: {
    title: 'SHOPPING CART API Documentation',
    description:
      'This is a SHOPPING CART API Documentation.'
  },
  deReference: false,
  securityDefinitions: {
    jwt: {
      type: 'Add Authorization Token here',
      name: 'Authorization',
      in: 'header'
    }
  },
  security: [{ jwt: [] }]
};

async function start() {
  try {
    const plugins = [
      Inert,
      Vision,
      hapiAuthJWT,
    ];
    plugins.push({
      plugin: HapiSwagger,
      options: swaggerOptions
    });
    await server.register(plugins);
    server.auth.strategy('jwt', 'jwt', {
      key: config.jwt.secretKey,
      validate: validateUser,
      verifyOptions: {
        ignoreExpiration: true
      }
    });

    server.auth.default('jwt');
    server.route(routes);
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Server running at: ', server.info);
}
start();
module.exports = server;