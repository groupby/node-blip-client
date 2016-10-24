const BlipClient = require('./lib');

const createClient = (url, port, service, environment) => {
  return new BlipClient({
    host:              url,
    port:              port,
    clientService:     service,
    clientEnvironment: environment
  });
};

module.exports.createClient = createClient;