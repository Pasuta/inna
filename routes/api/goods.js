const Router = require('koa-router');
const goodsCtrl = require(`../../controllers/api/goods`);
const router = new Router({
  prefix: '/api/goods'
});

router.get('/', goodsCtrl.getAll);
router.get('/:ID', goodsCtrl.findById);
router.post('/', goodsCtrl.create);

module.exports = router;
