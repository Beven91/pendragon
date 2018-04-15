
if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./devlopment').default;
}

module.exports.push = function () {
}