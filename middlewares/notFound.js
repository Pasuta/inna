module.exports = function *pageNotFound(next){
  yield next;

  if (this.status != 404) return;

  this.status = 404;

  switch (this.accepts('html', 'json')) {
    case 'html':
      this.type = 'html';
      this.body = '<p>404 Page Not Found</p>';
      break;
    case 'json':
      this.body = {
        message: '404 Page Not Found'
      };
      break;
    default:
      this.type = 'text';
      this.body = '404 Page Not Found';
  }
};
