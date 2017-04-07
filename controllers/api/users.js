const _ = require('lodash');
const User = require('../../models/User');
const Promise = require("bluebird");
const parse = require('co-body');
const error500 = require('../../helpers/error500');

function* getAll() {
  this.body = yield Promise.promisify(User.find, {context: User})();
}

function* findById() {
  const ID = Number(this.params.ID);
  if (_.isNaN(ID)) return error500.call(this, 'ID is not a number');
  const user = yield Promise.promisify(User.findOne, {context: User})({'ID': ID});
  return user ? this.body = user : error500.call(this, 'User with this id is not found');
}

function* create() {
  let data = yield parse(this);

  if (!_.has(data, 'fullname' || !_.has(data, 'address'))) {
    return error500.call(this, 'fullname or address is not setted');
  }

  const user = new User(data);
  const save = Promise.promisifyAll(user);
  const resp = yield save.saveAsync();
  this.body = {
    status: `OK`,
    message: `User ID:${resp.ID} has been successfully created`
  };
}

module.exports = { getAll, findById, create };
