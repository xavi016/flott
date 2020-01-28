const { validate, errors: { ConflictError } } = require('flott-util')
const { models: { User } } = require('flott-data')
const bcrypt = require('bcryptjs')

/**
* Register user
* 
* @param {string} name
* @param {string} surname 
* @param {string} email
* @param {string} username
* @param {string} password 
* @param {string} modalities
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {Promise}
* @return {string}  id Returns the user id
*/

module.exports = function (name, surname, email, username, password, modalities) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(password)
    validate.string.notVoid('password', password)

    validate.array(modalities)
    // validate.matches('modalities', modalities, 'bmx','skate', 'longboard','roller','scooter')

    return (async () => {
        const user = await User.findOne({ username })

        if (user) throw new ConflictError(`user with username ${username} already exists`)

        const hash = await bcrypt.hash(password, 10)

        await User.create({ name, surname, email, username, password: hash, modalities })
    })()
}
