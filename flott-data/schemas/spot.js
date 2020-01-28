const { Schema, ObjectId } = require('mongoose')
const Flags = require('./flags')
module.exports = new Schema({
    creator: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            index:"2dsphere",
            required: true
        }
    },
    modalities: [{
        type: String,
        enum: ['skate','longboard','roller','scooter','bmx'],
        required: true
    }],
    images: {
        type: Array
    },
    tags: {
        type: Array
    },
    totalFavs: {
        type: Number,
        default: 0,
        required: true
    },
    flag: Flags,
    comments: [{
        type: ObjectId,
        ref: 'Comments'
    }],
    lastModification: {
        type: Date
    }
})

