const bunyan       = require('bunyan');
const PrettyStream = require('bunyan-prettystream');
const prettyStdOut = new PrettyStream({mode: 'dev'});
prettyStdOut.pipe(process.stdout);

module.exports = bunyan.createLogger({
  name:    'blip-client',
  streams: [
    {
      type:   'raw',
      level:  'info',
      stream: prettyStdOut
    }
  ]
});