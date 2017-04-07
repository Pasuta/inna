const koa = require('koa');
const app = module.exports = new koa();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/innovecs');

const notFound = require('./middlewares/notFound');
const routes = require('./routes/routes');

app.use(routes.routes());
app.use(notFound);

app.listen(3011);
