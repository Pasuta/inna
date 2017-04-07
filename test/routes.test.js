const app = require('../app');
const request = require('supertest').agent(app.listen());
const should = require('should');

describe('404', function () {

  describe('when GET /unknown', function () {
    it('should return the 404 page', function (done) {
      request
        .get('/unknown')
        .expect(404)
        .expect(/Page Not Found/, done);
    })
  });
});
