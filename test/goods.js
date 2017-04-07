const app = require('../app');
const request = require('supertest').agent(app.listen());
const should = require('should');
const chai = require('chai');
const expect = chai.expect;
let ID;

describe('Test suit good', function () {

  describe('POST /goods', function () {
    it('should create new good', function (done) {
      request
        .post('/api/goods')
        .send({"description" : "some description", "price": 20})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);

          const response = res.body;

          expect(response).should.not.be.empty();
          response.should.have.property('status');
          response.should.have.property('message');
          response.status.should.be.eql('OK');

          done(err);
        });
    });
  });

  describe('GET /goods', function () {
    it('should return all goods', function (done) {
      request
        .get('/api/goods')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          const goods = res.body;
          expect(goods).to.have.length.above(0);

          ID = goods[0].ID;
          done(err);
        });
    });
  });

  describe('GET /goods/500', function () {
    it('should return current goods', function (done) {
      request
        .get('/api/goods/500')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          should.not.exist(err);
          const body = res.body;
          body.should.have.property('error');
          body.error.should.be.eql('Good with this id is not found');

          done(err);
        });
    });
  });

  describe('GET /goods/x', function () {
    it('should return error ID is not a number', function (done) {
      request
        .get('/api/goods/x')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          should.not.exist(err);
          const body = res.body;
          body.should.have.property('error');
          body.error.should.be.eql('ID is not a number');

          done(err);
        });
    });
  });

  describe(`GET /goods/ID`, function () {
    it('should return current goods', function (done) {
      request
        .get(`/api/goods/${ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);

          const user = res.body;

          expect(user).should.not.be.empty();
          user.should.have.property('description');
          user.should.have.property('price');
          user.description.should.be.eql('some description');
          user.price.should.be.eql(20);
          done(err);
        });
    });
  });

});
