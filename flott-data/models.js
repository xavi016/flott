 
const { model } = require('mongoose')
const { user, spot, socialMedia, flags } = require('./schemas')

module.exports = {
    User: model('User', user),
    Spot: model('Spot', spot),
    Socialmedia: model('Socialmedia', socialMedia),
    Flag: model('Flag', flags),
}