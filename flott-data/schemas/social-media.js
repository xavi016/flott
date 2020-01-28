const { Schema } = require('mongoose')

module.exports = new Schema({
    name: {
        type: String,
        enum: ['instagram','youtube','twitter','facebook']
    },
    link: {
        type: String
    }
})