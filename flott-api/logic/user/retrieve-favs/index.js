const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { ObjectId, models: { User, Spot } } = require('flott-data')

/**
* Retrieve favs
* 
* @param {string} id
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the user with the id
* 
* @return {Promise}
* @return {Array} favorites Returns favorites
*/

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        // const user = await User.findById(id).populate('favorites')
        const user = await User.findById(id).populate({path: 'favorites', populate: { path: 'creator'}})

        if (!user) throw new NotFoundError(`user with id ${id} not found`)

        const { favorites } = user
        let favoritesList = []
        favorites.forEach((favorite) => {
            const { id, name, tags, modalities, images, totalFavs, creator: {username, profileImage: userImage} } = favorite
            favoritesList.push({ id, name, tags, modalities, images, totalFavs, username, userImage })
            
        })

        
        return favoritesList
    })()
}
