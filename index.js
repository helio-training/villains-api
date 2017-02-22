require('babel-polyfill');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// const env = process.env.NODE_ENV;

// module.exports = require('./dist');

require('babel-register');

module.exports = require('./src');

// if (env === 'production') {
//   module.exports = require('./dist');
// } else {
//   require('babel-register');
//   module.exports = require('./src');
// }

