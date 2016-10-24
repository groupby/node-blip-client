/*eslint no-console: "off" */
const checker = require('gb-license-check');

const PACKAGE_WHITELIST = {
  'tweetnacl': ['^0.14.3'] // Has unlimited license https://github.com/dchest/tweetnacl-js/blob/master/COPYING.txt
};

checker.run(PACKAGE_WHITELIST, (err) => {
  if (err) {
    console.error('ERROR: Unknown licenses found');
    process.exit(1);
  }

  console.log('License check successful');
});