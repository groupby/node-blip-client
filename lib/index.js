/*eslint no-invalid-this: "off"*/
const HTTPStatus = require('http-status');
const Promise    = require('bluebird');
const log        = require('../logger');
const request    = Promise.promisify(require('request'));
Promise.promisifyAll(request);
const DEFAULT_PROTOCOL = 'http:';
const DEFAULT_PORT     = 80;
const ISO_8601_REGEX   = /^(\d{4})-(0[1-9]|1[0-2]|[1-9])-(\3([12]\d|0[1-9]|3[01])|[1-9])[tT\s]([01]\d|2[0-3]):(([0-5]\d)|\d):(([0-5]\d)|\d)([.,]\d+)?([zZ]|([+-])([01]\d|2[0-3]|\d):(([0-5]\d)|\d))$/;

const _   = require('lodash');
const url = require('url');

const inspector = require('schema-inspector');

const SCHEMA = {
  type:       'object',
  strict:     true,
  properties: {
    host: {
      type: 'string'
    },
    clientService: {
      type: 'string'
    },
    clientEnvironment: {
      type: 'string'
    },
    port: {
      type: 'integer'
    }
  }
};

const BlipClient = function (params) {
  const self = this;
  params = _.cloneDeep(params);
  inspector.sanitize(SCHEMA, params);
  const result = inspector.validate(SCHEMA, params);

  if (!result.valid) {
    throw new Error(result.format());
  }
  _.merge(self, params);

  self.blipResponseBody = function (requestObject) {
    return new Promise((resolve, reject) => {
      request(requestObject)
        .then((response) => {
          if (Number(response.statusCode) === HTTPStatus.OK) {
            resolve(response.body);
          } else {
            reject(`Returned non-200 status code: ${response.statusCode}`);
          }
        })
        .catch((error) => reject(error));
    });
  };

  self.generateBaseUri = function (urlObject) {
    const urlHost     = urlObject.hostname || urlObject.pathname;
    const urlProtocol = urlObject.protocol || DEFAULT_PROTOCOL;
    const urlPort     = self.port || DEFAULT_PORT;

    return `${urlProtocol}//${urlHost}:${urlPort}`;
  };

  self.getHealth = function () {
    const urlObject            = url.parse(self.host);
    const healthRequestObject  = {};
    healthRequestObject.method = 'GET';
    healthRequestObject.uri = `${self.generateBaseUri(urlObject)}/health`;

    return self.blipResponseBody(healthRequestObject);
  };

  self.write = function (data) {

    try {

      const urlObject = url.parse(self.host);

      if (data.date) {
        if (!(_.isString(data.date) && data.date.match(ISO_8601_REGEX))) {
          throw new Error('Date must be a string in ISO 8601 format');
        }
      } else {
        data.date = new Date().toISOString();
      }

      data.service = self.clientService;
      data.environment = self.clientEnvironment;

      const writeRequestObject = {
        method: 'POST',
        uri:    `${self.generateBaseUri(urlObject)}/write`,
        json:   true,
        body:   data
      };

      return self.blipResponseBody(writeRequestObject).catch((err) => {
        log.error(`Rejection during blip.write: ${err}`);
      });
    } catch (err) {
      log.error(`Error thrown during blip.write: ${err}`);
    }
  };
};

module.exports = BlipClient;
