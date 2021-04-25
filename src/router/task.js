const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middleware/auth')

//Task Routes

router.get('/tasks', auth, async (req, res) => {
    try{
        const {user,query:{completed, limit, skip, sortBy}} = req
        const match = {}
        const sort = {}
        if(completed){
            match.completed = completed==='true'?true:false
        }
        if(sortBy){
            const [sortParam, order] = sortBy.split(':')
            sort[sortParam] = order === 'asc' ? 1 : -1 
        }
        // const tasks = await Task.find({owner: req.user._id})
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        }).execPopulate()
        res.send(user.tasks)
    }catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id})
        await task.populate('owner').execPopulate()
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.post('/tasks', auth, async (req, res) => {
    try{
        const task = new Task({
            ...req.body,
            owner:req.user._id
        })
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router