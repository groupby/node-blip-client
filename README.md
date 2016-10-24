# node-blip-client
Send your blips. Send them.

## Install
```bash
npm install --save blip-client
```

## Use
```javascript
const BlipClient = require('blip-client');
const blipClient = BlipClient.createClient('server.something.com', 8080, 'sourceService', 'PROD');

blipClient.write({
  someDataPoint: 'this is it',
  also: 'another thing'
});
```