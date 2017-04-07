const Router = require('koa-router');

const users = require(`../routes/api/users`).routes();
const goods = require(`../routes/api/goods`).routes();
const orders = require(`../routes/api/orders`).routes();

const router = new Router();

router.use(users, goods, orders);

module.exports = router;
