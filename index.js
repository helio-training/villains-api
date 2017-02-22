require('babel-polyfill');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = process.env.NODE_ENV;


if (env === 'production') {
  module.exports = require('./dist');
} else {
  require('babel-register');
  module.exports = require('./src');
}

