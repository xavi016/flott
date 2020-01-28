const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { ObjectId, models: { User } } = require('flott-data')

/**
* Toggle fav
* 
* @param {string} userId
* @param {string} spotId
* 
*/

module.exports = function (userId, spotId) {

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(spotId)
    validate.string.notVoid('spotId', spotId)  
    if (!ObjectId.isValid(spotId)) throw new ContentError(`${spotId} is not a valid id`)

    return (async () => {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        
        const favIndex = user.favorites.indexOf(spotId)

        if(favIndex === -1) {
            user.favorites.push(spotId)
        } else {
            user.favorites.splice(favIndex, 1)
        }
        
        await user.save()
    })()
}