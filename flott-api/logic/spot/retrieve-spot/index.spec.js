require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveSpot = require('.')
const { errors: { NotFoundError }, polyfills: { shuffle } } = require('flott-util')
const { database, models: { Spot, User } } = require('flott-data')
const bcrypt = require('bcryptjs')
const randomCoordinates = require('random-coordinates')

describe('logic - retrieve spot', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, _name, surname, email, username, password
    let spotname, description, longitude, latitude, modalities, tags, flags

    beforeEach(async () => {
        _name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)

        coordinates = randomCoordinates()
        coordinates = coordinates.split(',')
        
        modalities = ['skate','longboard','roller','scooter','bmx']
        const numItems = floor(random() * modalities.length)
        modalities = modalities.shuffle().splice(0, numItems)
        
        spotname = `new-spotname-${random()}`
        description = `description-${random()}`
        latitude = +coordinates[0]
        longitude = +coordinates[1]
        tags = ['random', 'skate', 'word']
        flag = {
                fountain: false,
                supermarket: false,
                publicTransport: false,
                parking: true
                }

        await Promise.all([User.deleteMany(), Spot.deleteMany()])

        const user = await User.create({ name: _name, surname, email, username, password: hash })
        id = user.id

        const _spot = await Spot.create({ creator: id, name: spotname, description, location: { type: "Point", coordinates: [longitude, latitude] }, modalities, tags, flag })
        idSpot = _spot.id
    })

    it('should succeed on correct spot id', async () => {
        const spot = await retrieveSpot(id, idSpot)

        expect(spot).to.exist
        expect(spot.id).to.equal(idSpot)
        expect(spot.id).to.be.a('string')
        expect(spot._id).to.not.exist
        expect(spot.creatorId.toString()).to.equal(id)
        expect(spot.creatorId.toString()).to.be.a('string')
        expect(spot.creatorName.toString()).to.equal(_name)
        expect(spot.creatorName.toString()).to.be.a('string')
        expect(spot.creatorSurname.toString()).to.equal(surname)
        expect(spot.creatorSurname.toString()).to.be.a('string')
        expect(spot.creatorUsername.toString()).to.equal(username)
        expect(spot.creatorUsername.toString()).to.be.a('string')
        expect(spot.name).to.equal(spotname)
        expect(spot.name).to.be.a('string')
        expect(spot.description).to.equal(description)
        expect(spot.description).to.be.a('string')
        expect(spot.longitude).to.equal(longitude)
        expect(spot.longitude).to.be.a('number')
        expect(spot.latitude).to.equal(latitude)
        expect(spot.latitude).to.be.a('number')
        expect(spot.modalities).to.be.an('array')
        expect(spot.modalities).to.deep.equal(modalities)
        expect(spot.tags).to.be.an('array')
        expect(spot.tags).to.deep.equal(tags)
        expect(spot.totalFavs).to.be.a('number')
        expect(spot.totalFavs).to.equal(0)
        expect(spot.flag).to.be.an('object')
        expect(spot.flag.fountain).to.equal(flag.fountain)
        expect(spot.flag.supermarket).to.equal(flag.supermarket)
        expect(spot.flag.publicTransport).to.equal(flag.publicTransport)
        expect(spot.flag.parking).to.equal(flag.parking)
        expect(spot.lastModification).to.exist
        expect(spot.lastModification).to.be.an.instanceOf(Date)
    })

    it('should fail on wrong spot id', async () => {
        const spotId = '012345678901234567890123'

        try {
            await retrieveSpot(id, spotId)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`spot with id ${spotId} not found`)
        }
    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(database.disconnect))
})
