const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')

//User Routes

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/:id', auth, async (req, res) => {
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

router.post('/users', async (req, res) => {
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({error : e.message})
    }
})

router.patch('/users/:id', auth, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', auth, async (req, res) => {
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

module.exports = router