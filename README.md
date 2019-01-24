# node-blip-client

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/12d76c0f71184d7ba31d74e8c380698c)](https://www.codacy.com/app/GroupByInc/node-blip-client?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=groupby/node-blip-client&amp;utm_campaign=badger)

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