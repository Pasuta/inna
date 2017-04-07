const _ = require('lodash');
const Order = require('../../models/Order');
const Promise = require("bluebird");
const parse = require('co-body');
const request = require('request');
const koaRequest = require('koa-request');
const error500 = require('../../helpers/error500');

function* getAll() {
  this.body = yield Promise.promisify(Order.find, {context: Order})();
}

function* findById() {
  const ID = Number(this.params.ID);
  if (_.isNaN(ID)) return error500.call(this, 'ID is not a number');
  const order = yield Promise.promisify(Order.findOne, {context: Order})({'ID': ID});
  return order ? this.body = order : error500.call(this, 'Order with this id is not found');
}

function* create(next) {
  let data = yield parse(this);
  const host = this.req.headers.host;

  if (!_.has(data, 'deliveryAddress' || !_.has(data, 'userId'))) {
    return error500.call(this, 'deliveryAddress or userId is not setted');
  }

  const userId = Number(data.userId);
  if (_.isNaN(userId)) return error500.call(this, 'userId is not a number');

  const options = {
    url: `http://${host}/api/users/${userId}`,
    headers: { 'User-Agent': 'request' }
  };

  const response = yield koaRequest(options);
  const user = JSON.parse(response.body);

  if (_.has(user, 'error')) return error500.call(this, user.error);

  data.user = user._id;

  const order = new Order(data);
  const save = Promise.promisifyAll(order);
  const resp = yield save.saveAsync();
  this.body = {
    status: `OK`,
    message: `Order ID:${resp.ID} has been successfully created`
  };
  yield next;
}

function* addGoods(next) {
  let data = yield parse(this);

  if (!_.has(data, 'goods' || !_.has(data, 'orderId'))) {
    return error500.call(this, 'goods or orderId is not setted');
  }

  const orderId = Number(data.orderId);
  if (_.isNaN(orderId)) return error500.call(this, 'orderId is not a number');

  const goodsIds = data.goods;

  if (!_.isArray(goodsIds)) return error500.call(this, 'good should be an array');
  if (!_.every(goodsIds, Number)) return error500.call(this, 'Each element in array should be Number');

  const host = this.req.headers.host;
  const queries = [];
  const goods = [];

  _.forEach(goodsIds, good => queries.push(requestStream(`http://${host}/api/goods/${good}`, goods)));

  yield Promise.all(queries);

  const query = {'ID': orderId};
  const update = {$push: {"good": { $each: goods }}};

  const order = yield Promise.promisify(Order.findOneAndUpdate, {context: Order})(query, update);
  if (order === null) return error500.call(this, 'Order with this id is not found');
  this.body = {
    status: `OK`,
    message: `Order ID:${order.ID} has been successfully updated`
  };
  yield next;
}

function requestStream(url, result) {
  return new Promise(function (resolve, reject) {
    request.get({url})
      .on('response', function (res) {
        if (res.statusCode !== 200) {
          result.push({
            error: res.statusMessage,
            statusCode: res.statusCode
          });
        }
      })
      .on('error', reject)
      .on('data', data => {
        try {
          result.push(JSON.parse(data).data);
        } catch (e) {
          resolve(e);
        }
      })
      .on('end', resolve);
  });
}

module.exports = { getAll, findById, addGoods, create };
