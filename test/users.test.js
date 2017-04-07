const app = require('../app');
const request = require('supertest').agent(app.listen());
const should = require('should');
const chai = require('chai');
const expect = chai.expect;
let ID;

describe('Test suit user', function () {

  describe('POST /users', function () {
    it('should create new user', function (done) {
      request
        .post('/api/users')
        .send({"fullname" : "Adam", "address": "Amosova 12"})
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
  
  describe('GET /users', function () {
    it('should return all users', function (done) {
      request
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          const users = res.body;
          expect(users).to.have.length.above(0);

          ID = users[0].ID;
          done(err);
        });
    });
  });

  describe('GET /users/500', function () {
    it('should return error user not found users', function (done) {
      request
        .get('/api/users/500')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .end((err, res) => {
          should.not.exist(err);
          const body = res.body;
          body.should.have.property('error');
          body.error.should.be.eql('User with this id is not found');

          done(err);
        });
    });
  });

  describe('GET /users/x', function () {
    it('should return error ID is not a number', function (done) {
      request
        .get('/api/users/x')
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

  describe(`GET /users/ID`, function () {
    it('should return current users', function (done) {
      request
        .get(`/api/users/${ID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);

          const user = res.body;

          expect(user).should.not.be.empty();
          user.should.have.property('fullname');
          user.should.have.property('address');
          user.fullname.should.be.eql('Adam');
          user.address.should.be.eql('Amosova 12');
          done(err);
        });
    });
  });

});
