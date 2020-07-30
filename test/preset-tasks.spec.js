const knex = require('knex')
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { seedTasksTable } = require('./test-helpers');
const { expect } = require('chai');
let date = new Date();

describe('Preset Tasks Router', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  beforeEach('seed users table for auth', () => {
    helpers.seedUsers(db, testUsers)
  })

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /preset-tasks', () => {
    it('responds with 404 if no tasks', () => {
      return supertest(app)
        .get('/preset-tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(404, { error: 'You have no preset tasks' });
    })
    it('responds with list of tasks if avaiable', () => {
      before('seed tasks table', helpers.seedPresetTasksTable(db, helpers.makePresetTasksArray()))
      return supertest(app)
        .get('/preset-tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200);
    }) 
  })

  describe('POST /preset-tasks', () => {
    it('responds with 400 if field missing', () => {
      const noNameTestTask = {
        user_id: 1,
        duration: '2:30',
        description: 'This is a test description',
      }

      return supertest(app)
        .post('/preset-tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(noNameTestTask)
        .expect(400)
    })
    it('successfully posts to database', () => {
      const testTask = {
        task_name: 'TEST POST TASK',
        duration: '2:30',
        description: 'This is a test description',
      }

      return supertest(app)
        .post('/preset-tasks')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(testTask)
        .expect(200)
    })
  })

  describe('GET /preset-tasks/:id', () => {
    it('responds with 404 if no tasks', () => {
      return supertest(app)
        .get('/preset-tasks/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(404)
    })
    it('responds with the task if exists', () => {
      before('seed tasks table', seedTasksTable(db, helpers.makePresetTasksArray()))
      return supertest(app)
        .get('/preset-tasks/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
    })
  })

  describe('PATCH /preset-tasks/:id', () => {
    it('responds with 400 if no field is passed in', () => {
      return supertest(app)
        .patch('/preset-tasks/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({})
        .expect(400)
    })
    it('successfully updates the preset task', () => {
      const taskToUpdate = {
        task_name: 'TEST UPDATE',
        duration: '1:45',
        description: 'This is an updated test description',
        task_date: date.toISOString(),
      }

      return supertest(app)
        .patch('/preset-tasks/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(taskToUpdate)
        .expect(200)
    })
  })

  describe('DELETE /preset-tasks/:id', () => {
      before('seed tasks table', seedTasksTable(db, helpers.makePresetTasksArray()))
      it('responds with 404 if task doesn\'t exist', () => {
      return supertest(app)
        .delete('/preset-tasks/10000')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(404, { error: 'That task does not exist. Try again.' })
    })
    it('successfully deletes the message', () => {
      return supertest(app)
        .delete('/preset-tasks/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(404, { error: 'That task does not exist. Try again.' })
    })
  })
});