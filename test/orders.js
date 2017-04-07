const app = require('../app');
const request = require('supertest').agent(app.listen());
const should = require('should');
const chai = require('chai');
const expect = chai.expect;
let ID;

describe('Test suit orders', function () {

  describe('POST /goods', function () {
    it('should create new good with price 20', function (done) {
      request
        .post('/api/goods')
        .send({"description" : "some description1", "price": 20, "ID": 101})
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

  describe('POST /goods', function () {
    it('should create new good with price 40', function (done) {
      request
        .post('/api/goods')
        .send({"description" : "some description2", "price": 40, "ID": 102})
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

  describe('POST /users', function () {
    it('should create new user', function (done) {
      request
        .post('/api/users')
        .send({"fullname" : "Adam", "address": "Amosova 12", "ID": 201})
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

  describe('POST /orders', function () {
    it('should create new order', function (done) {
      request
        .post('/api/orders')
        .send({"deliveryAddress" : "address", "userId": 201})
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

  describe('GET /orders', function () {
    it('should return all orders', function (done) {
      request
        .get('/api/orders')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          const orders = res.body;
          expect(orders).to.have.length.above(0);

          ID = orders[0].ID;
          done(err);
        });
    });
  });

  describe('GET /orders/500', function () {
    it('should return current order', function (done) {
      request
        .get('/api/orders/500')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          should.not.exist(err);
          const body = res.body;
          body.should.have.property('error');
          body.error.should.be.eql('Order with this id is not found');

          done(err);
        });
    });
  });

  describe('GET /orders/x', function () {
    it('should return error ID is not a number', function (done) {
      request
        .get('/api/orders/x')
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

  describe(`GET /orders/ID`, function () {
    it('should return current orders', function (done) {
      request
        .get(`/api/orders/${ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);

          const order = res.body;

          expect(order).should.not.be.empty();
          order.should.have.property('deliveryAddress');
          order.deliveryAddress.should.be.eql('address');
          done(err);
        });
    });
  });

  describe(`PUT /orders`, function () {
    it('should update current order', function (done) {
      request
        .put(`/api/orders`)
        .send({
          "goods" : [101, 102],
          "orderId": ID
        })
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


  describe(`GET /orders/ID`, function () {
    it('should return current order with proper data', function (done) {
      request
        .get(`/api/orders/${ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);

          const order = res.body;

          expect(order).should.not.be.empty();
          order.should.have.property('good');
          expect(order.good).to.have.lengthOf(2);
          done(err);
        });
    });
  });

});
