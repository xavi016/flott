const { Schema, ObjectId } = require('mongoose')
const { validators: { isEmail } } = require('flott-util')
const { social } = require('./')

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: isEmail
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    modalities: [{
        type: String,
        enum: ['skate','longboard','roller','scooter','bmx'],
        required: true
    }],
    profileImage: {
        type: String
    },
    socialMedia: {
        type: [social]
    },
    favorites: [{
        type: ObjectId,
        ref: 'Spot'
    }],
    lastAccess: {
        type: Date
    }
})