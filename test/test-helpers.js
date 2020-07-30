const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const date = new Date()
const AuthServices = require('../src/auth/auth-services')

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Smith',
      username: 'test-user-1',
      password: '@passWord1',
      email:'johnsmith@test.com',
      date_created: date.toISOString(),
    },
    {
      id: 2,
      first_name: 'Michael',
      last_name: 'Smith',
      username: 'test-user-2',
      password: '@passWord1',
      email:'johnsmith@test.com',
      date_created: date.toISOString(),
    },
    {
      id: 3,
      first_name: 'Bob',
      last_name: 'Smith',
      username: 'test-user-3',
      password: '@passWord1',
      email:'johnsmith@test.com',
      date_created: date.toISOString(),
    },
  ]
}

function makeTasksArray(users) {
  return [
    {
      id: 1,
      user_id: 1,
      task_name: 'Find a new front desk employee',
      duration: '2:30',
      description: 'This is a test description',
      task_date: date.toISOString(),
      flagged: false
    },
    {
      id: 2,
      user_id: 1,
      task_name: 'Find a new back desk employee',
      duration: '1:30',
      description: 'This is a test description',
      task_date: date.toISOString(),
      flagged: false
    },
    {
      id: 3,
      user_id: 2,
      task_name: 'Find a new sandwich',
      duration: '2:30',
      description: 'This is a test description',
      task_date: date.toISOString(),
      flagged: false
    },
    {
      id: 4,
      user_id: 3,
      task_name: 'Find an office',
      duration: '1:00',
      description: 'This is a test description',
      task_date: date.toISOString(),
      flagged: false
    },
    {
      id: 5,
      user_id: 2,
      task_name: 'Find a dog',
      duration: '5:00',
      description: 'This is a test description',
      task_date: date.toISOString(),
      flagged: false
    },
  ];
}

function makePresetTasksArray(users) {
  return [
    {
      id: 1,
      user_id: 1,
      task_name: 'PRESET TASK 1',
      duration: '2:30',
      description: 'This is a test description',
      flagged: false
    },
    {
      id: 2,
      user_id: 1,
      task_name: 'PRESET TASK 2',
      duration: '1:30',
      description: 'This is a test description',
      flagged: false
    }
  ];
}

function makeExpectedTask(task) {
  return {
    id: task.id,
    user_id: task.user_id,
    task_name: task.task_name,
    duration: task.duration,
    description: task.description,
    task_date: task.task_date,
    flagged: task.flagged
  }
}

function makeMessagesFixtures() {
  const testUsers = makeUsersArray()
  const testMessages = makeMessagesArray(testUsers)
  return {
    testUsers,
    testMessages
  }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
      users,
      preset_tasks,
      tasks
    `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tasks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE preset_tasks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('tasks_id_seq', 0)`),
          trx.raw(`SELECT setval('preset_tasks_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.insert(hashedUsers).into('users')
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        users[users.length - 1].id
      )
    );
};


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({
    user_id: user.id
  }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  let sub = user.username
  let payload = { user_id: user.id }
  return `Bearer ${token}`; 
  return AuthServices.createJwt(sub, payload)
};

function seedTasksTable(db, tasks = [], users = makeUsersArray()) {
  return db.into('tasks').insert(tasks)

  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('tasks').insert(tasks)
    await trx.raw(
      `SELECT setval('tasks_id_seq', ?)`,
      [tasks[tasks.length - 1].id],
    )
  })
};

function seedPresetTasksTable(db, users, preset_tasks = []) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('preset_tasks').insert(preset_tasks)
    await trx.raw(
      `SELECT setval('preset_tasks_id_seq', ?)`,
      [preset_tasks[preset_tasks.length - 1].id],
    )
  })
};

module.exports = {
  makeAuthHeader,
  makeUsersArray,
  makeTasksArray,
  makePresetTasksArray,
  makeExpectedTask,
  makeMessagesFixtures,
  cleanTables,
  seedUsers,
  seedTasksTable,
  seedPresetTasksTable
}