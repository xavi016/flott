const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { ObjectId, models: { User } } = require('flott-data')

/**
* Retrieve user
* 
* @param {string} id
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Promise}
* @return {string} id Returns the user id
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const user = await User.findById(id)

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        user.lastAccess = new Date

        await user.save()

        const { name, surname, email, username, favorites, lastAccess } = user.toObject()

        return { id, name, surname, email, username, favorites, lastAccess }
    })()
}
