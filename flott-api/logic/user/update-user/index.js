const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { ObjectId, models: { User } } = require('flott-data')

/**
* Update user
* 
* @param {string} id
* @param {string} name
* @param {string} surname 
* @param {string} email
* @param {string} username
* @param {string} password 
* @param {string} description 
* @param {string} modalities 
* @param {string} profileImage
* @param {string} socialMedia 
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Promise}
*/

module.exports = function (id, name, surname, username, email, password, description, modalities, socialMedia) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    if (name) {
        validate.string(name)
        validate.string.notVoid('name', name)
    }
    if (surname) {
        validate.string(surname)
        validate.string.notVoid('surname', surname)
    }
    if (email) {
        validate.string(email)
        validate.string.notVoid('email', email)
    }
    if (username) {
        validate.string(username)
        validate.string.notVoid('username', username)
    }
    if (password) {
        validate.string(password)
        validate.string.notVoid('password', password)
    }
    if (description) {
        validate.string(description)
        validate.string.notVoid('description', description)
    }
    if (modalities) {
        validate.array(modalities)
    }
    if (socialMedia) {
        validate.instanceOf(Object, socialMedia)
    }

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const update = {}

        name && (update.name = name)
        surname && (update.surname = surname)
        email && (update.email = email)
        username && (update.username = username)
        password && (update.password = password)
        description && (update.description = description)
        modalities && (update.modalities = modalities)
        socialMedia && (update.socialMedia = socialMedia)
        update.lastAccess = new Date

        await User.updateOne({ _id: ObjectId(id) }, { $set: update })
    })()
}