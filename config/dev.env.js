'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// production

// production  development
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
