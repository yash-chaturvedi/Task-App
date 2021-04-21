const express = require('express')

require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

//Task Routes

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

app.patch('/tasks/:id', async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

//User Routes

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

app.patch('/users/:id', async (req, res) => {
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

app.listen(port, () => console.log('Server is running on port ' + port))