const Router = require('koa-router');
const usersCtrl = require(`../../controllers/api/users`);
const router = new Router({
  prefix: '/api/users'
});

router.get('/', usersCtrl.getAll);
router.get('/:ID', usersCtrl.findById);
router.post('/', usersCtrl.create);

module.exports = router;
