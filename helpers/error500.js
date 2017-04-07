module.exports = function (message) {
  this.status = 500;
  this.type = 'json';
  this.body = {error: message};
  return this;
};
