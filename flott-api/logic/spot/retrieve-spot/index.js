const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { ObjectId, models: { Spot, User } } = require('flott-data')

/**
* Retrieve spot
* 
* @param {string} idUser
* @param {string} idSpot
* 
* @throws {ContentError} If id hasn't got the correct format
* 
* @throws {NotFoundError} If doesn't find the spot with the id
* 
* @return {Promise}
* @return {Object} object Returns an object with the spot information
*/

module.exports = function (idUser, idSpot) {
    
    if(idUser !== "undefined"){
        validate.string(idUser)
        validate.string.notVoid('idUser', idUser)
        if (!ObjectId.isValid(idUser)) throw new ContentError(`${idUser} is not a valid id`)
    }

    validate.string(idSpot)
    validate.string.notVoid('idSpot', idSpot)
    if (!ObjectId.isValid(idSpot)) throw new ContentError(`${idSpot} is not a valid id`)

    return (async () => {
        const spot = await Spot.findById(idSpot).populate('creator')
        if (!spot) throw new NotFoundError(`spot with id ${idSpot} not found`)

        spot.lastModification = new Date

        await spot.save()

        const { creator : {  id: creatorId, name: creatorName, surname: creatorSurname, username: creatorUsername }, id, name, description, images, location: { coordinates }, modalities, tags, totalFavs, flag, lastModification } = spot
      
        const longitude = coordinates[0]
        const latitude = coordinates[1]
        let isFav = undefined
          
        if(idUser !== "undefined"){
            const user = await User.findById(idUser)
            if (!user) throw new NotFoundError(`user with id ${idUser} not found`)
            isFav = user.favorites.includes(id)
        }
        // const longitude = coordinates[0]
        // const latitude = coordinates[1]
        return { id, creatorId, creatorName, creatorSurname, creatorUsername, name, description, images, longitude, latitude, modalities, tags, totalFavs, flag, isFav, lastModification }
    })()
}
