const { validate, errors: { NotFoundError, ContentError } } = require('flott-util')
const { models: { Spot, User } } = require('flott-data')

/**
* Retrieve all spots
*  
* @param {Array} userCoordinates
* @param {Number} radius
* @param {string} query
* @param {Array} sports
* 
* @return {Promise}
* @return {Array} id Returns an array with all results
*/

module.exports = function (idUser, userCoordinates, radius, query, sports) {
    let user
    // , numFavs, fountain, supermarket, publicTransport, parking
    if(idUser !== "undefined"){
        validate.string(idUser)
        validate.string.notVoid('idUser', idUser)
    }
    userCoordinates ? validate.array(userCoordinates) : userCoordinates = [41,2]
    radius ? validate.number(radius) : radius = 130000
    sports ? validate.array(sports) : sports = ['skate','longboard','roller','scooter','bmx']

    radius && validate.number(radius, 'radius')
    if(query){
        validate.string(query)
        validate.string.notVoid('query', query)
    }else{
        query = " "
    }

    return (async () => {
        
        const spots = await Spot.find({$and:[
                                        { location: { $nearSphere: { $geometry: { type: "Point", coordinates: userCoordinates },$maxDistance: radius } }},
                                        {"modalities": {$in: sports}},
                                        { $or:[ 
                                            { "name" : {$regex : `.*${query}*`, $options: 'i'}},
                                            { "tags": {$in: query}}]
                                        }]}).populate('creator').sort({ 'totalFavs' : 0})

        let results = []
        if(idUser !== "undefined"){
            user = await User.findById(idUser)
            if (!user) throw new NotFoundError(`user with id ${idUser} not found`)
        }
        
        spots.forEach(elem => {
            const { id, name, tags, modalities, images, totalFavs, creator: {username, profileImage: userImage} } = elem
            let place = { id, name, tags, modalities, images, totalFavs, username, userImage }

            if(idUser !== "undefined"){
                elem.isFav = user.favorites.includes(id)
            }else{
                elem.isFav = undefined
            }
            results.push(place)
        })
        return results
    })()
}
