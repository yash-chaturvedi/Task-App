const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userTwo, userOne, setUpDB, taskOne} = require('./fixtures/db')

beforeEach(setUpDB)

test('should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From tests'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get tasks for user', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const tasks = response.body
    expect(tasks.length).toEqual(2)
})

test('should not delete task for different user', async () => {
    const response = request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
