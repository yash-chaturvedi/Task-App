const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "zeus",
    email: "zeus@example.com",
    password: "1234@zeus",
    tokens:[{
        token: jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "zeref",
        email: "zeref@example.com",
        password : "1234@zeref"
    }).expect(201)
    
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: "zeref",
            email: "zeref@example.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("1234@zeref")
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: "zeref@demo.com",
        password: "1234@zeref"
    }).expect(400)
})

test('should get user profile', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
