const { Schema } = require('mongoose')

module.exports = new Schema({
    fountain: {
        type: Boolean
    },
    supermarket: {
        type: Boolean,
        default: false
    },
    publicTransport: {
        type: Boolean,
        default: false
    },
    parking: {
        type: Boolean,
        default: false
    }
})