const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => {
    try{
        const id = req.params.id
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

app.post('/tasks', async (req, res) => {
    try{
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    try{
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

app.post('/users', async (req, res) => {
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(port, () => console.log('Server is running on port ' + port))