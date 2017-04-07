const Router = require('koa-router');
const ordersCtrl = require(`../../controllers/api/orders`);
const router = new Router({
  prefix: '/api/orders'
});

router.get('/', ordersCtrl.getAll);
router.get('/:ID', ordersCtrl.findById);
router.post('/', ordersCtrl.create);
router.put('/', ordersCtrl.addGoods);

module.exports = router;
