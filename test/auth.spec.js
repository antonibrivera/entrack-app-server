const knex = require('knex');
require('dotenv').config();
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe.only('Auth Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  before(() => helpers.seedUsers(db))

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /auth/login', () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers
      )
    );

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };


      it('responds with 400 required error when field is missing', () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing value for ${field} in request body` });
      });
    });
    it('responds 400 invalid username or password when invalid username', () => {
      const userInvalidUser = { username: 'invalid', password: 'exists' };

      return supertest(app)
        .post('/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect username or password. Try again.' });
    });
    it('responds 400 invalid username or password when invalid password', () => {
      const userInvalidPassword = { username: testUser.username, password: 'invalid' };
      return supertest(app)
        .post('/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: 'Incorrect username or password. Try again.' });
    });
    it('responds 200 and JWT auth when valid credentials', () => {

      const validCreds = {
        username: testUser.username,
        password: testUser.password
      };

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256'
        },
      );

      return supertest(app)
        .post('/auth/login')
        .send(validCreds)
        .expect(200, { authToken: expectedToken });
    });
  });

  describe('GET /user', () => {
    it('should respond with the logged-in user\'s first & last name', () => {
      return supertest(app)
        .get('/auth/user')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, {
          first_name: testUser.first_name,
          last_name: testUser.last_name
        })
    })
  })
});