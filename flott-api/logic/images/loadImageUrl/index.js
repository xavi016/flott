require('dotenv').config()
const { validate } = require('flott-util')
const { ObjectId, models: { User } } = require('flott-data')
const fs = require('fs')
const path = require('path')


/**
 * Load the user profile image
 * 
 * @param {ObjectId} id of the user
 * @param {Sting} type 
 *
 * @returns {Promise} - data of image  
 */


module.exports = function(id, type) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(type)
    validate.string.notVoid('type', type)
    validate.matches('type', type, 'users','spots')


    return (async() => {
        /*   const user = await User.findById(id)
          if (!user) throw new Error(`user with id ${id} not found`) */
        let goTo, defaultImage

        goTo = path.join(__dirname, `../../../data/${type}/${id}/profile.png`)
        defaultImage = path.join(__dirname, `../../../data/${type}/defaultImage/profile.jpg`)

        try {
            if (await fs.existsSync(goTo)) {
                return goTo
            } else {
                return defaultImage
            }
        } catch (error) {
            throw new Error (error)
        }

    })()
}