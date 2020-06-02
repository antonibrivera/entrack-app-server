const app = require('../src/app');

describe('Tasks Router', () => {
  it('GET / responds with 200 containing list of tasks', () => {
    return supertest(app)
      .get('/tasks')
      .expect(200, 'Hello, world!')
  })
});