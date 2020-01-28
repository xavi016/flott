 
require('dotenv').config()
const { validate } = require('flott-util')
const { ObjectId, models: { User, Spot } } = require('flott-data')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

/**
 * Saves user profile image.
 * 
 * @param {ObjectId} id
 * @param {Stream} file
 * @param {Sting} filename 
 * @param {Sting} type 
 *
 * @returns {Promise} - user.  
 */


module.exports = function(id, file, filename, type) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    validate.string(type)
    validate.string.notVoid('type', type)
    validate.matches('type', type, 'users','spots')

    /* fs.readFile(__dirname) */

    return (async() => {

        imgPath = path.join(__dirname, `../../../public/data/${type}/${id}/${filename}`)
        route = path.join(__dirname, `../../../public/data/${type}/${id}/`)

        try {
            const spot = await Spot.findById(id)
            spot.images.push(`http://localhost:8000/data/${type}/${id}/${filename}`)
            await spot.save()

            if (fs.existsSync(route)) {
                return file.pipe(fs.createWriteStream(imgPath))
                
            } else {
                fs.mkdirSync(route)
                return file.pipe(fs.createWriteStream(imgPath))
                
            }
        } catch (error) {
            return error
        }

    })()
}