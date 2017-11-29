
if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./index.devlopment').default;
}

module.exports.onCat = function (error) {
  console.error(error);
}