const _ = require('lodash');
const Good = require('../../models/Good');
const Promise = require("bluebird");
const parse = require('co-body');
const error500 = require('../../helpers/error500');

function* getAll() {
  this.body = yield Promise.promisify(Good.find, {context: Good})();
}

function* findById() {
  const ID = Number(this.params.ID);
  if (_.isNaN(ID)) return error500.call(this, 'ID is not a number');
  const good = yield Promise.promisify(Good.findOne, {context: Good})({'ID': ID});
  return good ? this.body = good : error500.call(this, 'Good with this id is not found');
}

function* create() {
  let data = yield parse(this);

  if (!_.has(data, 'description' || !_.has(data, 'price'))) {
    return error500.call(this, 'description or price is not setted');
  }

  const good = new Good(data);
  const save = Promise.promisifyAll(good);
  const resp = yield save.saveAsync();
  this.body = {
    status: `OK`,
    message: `Good ID:${resp.ID} has been successfully created`
  };
}

module.exports = { getAll, findById, create };
