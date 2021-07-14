const mongoose = require('mongoose')
const {isEmail, isNumeric} = require('validator')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    data: {
        type: String,
        required: true,
        unique: true
    }
})

const Patient = mongoose.model('patients', patientSchema)

module.exports = Patient