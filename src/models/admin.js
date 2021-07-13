const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
    login:{
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

adminSchema.statics.findByCredentials = async (login, password) => {
    const admin = await Admin.findOne({login})
    if(!admin){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return admin
}

adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({_id: admin._id}, process.env.JWT_SECRET)
    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    return token
}

adminSchema.pre('save', async function(next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
}) 

const Admin = mongoose.model('admin', adminSchema)

module.exports = Admin