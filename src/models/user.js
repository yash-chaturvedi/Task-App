const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age cannot be a negative number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this.toObject();
    delete user.password
    delete user.tokens
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({_id : user._id.toString()}, 'MySecretCode')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email}) 
    if(!user){
        throw new Error('Login Failed !')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if(!isEqual){
        throw new Error('Login Failed !')
    }
    return user
}

//Middleware to hash the plain text password before saving user
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Middleware to delete all the tasks associated with the user before deleting it
userSchema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User