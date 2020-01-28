require('dotenv').config()

const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const registerSpot = require('.')
const { random, floor } = Math
const { errors: { ContentError }, polyfills: { shuffle } } = require('flott-util')
const { database, models: { Spot, User } } = require('flott-data')
const randomCoordinates = require('random-coordinates')
const bcrypt = require('bcryptjs')

describe('logic - register spot', () => {
    before(() => database.connect(TEST_DB_URL))

    let creator, spotname, description, longitude, latitude, modalities, images, tags, flags, coordinates, _name, surname, email, username, password, hash

    beforeEach(async() => {
        
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
        flags = {
                fountain: false,
                supermarket: false,
                publicTransport: false,
                parking: true
                }
        
        await Promise.all([User.deleteMany(), Spot.deleteMany()])

        const user = await User.create({ name: _name, surname, email, username, password: hash })

        creator = user.id
    })

    it('should succeed on correct credentials', async () => {
        
        const idSpot = await registerSpot(creator, spotname, description, longitude, latitude, modalities, tags, flags)

        expect(idSpot).to.exist
        expect(idSpot).to.be.a('string')

        const spot = await Spot.findById(idSpot)
        
        expect(spot).to.exist
        expect(spot.name).to.be.a('string')
        expect(spot.name).to.equal(spotname)
        expect(spot.description).to.be.a('string')
        expect(spot.description).to.equal(description)
        expect(spot.location.coordinates[0]).to.equal(longitude)
        expect(spot.location.coordinates[0]).to.be.a('number')
        expect(spot.location.coordinates[1]).to.equal(latitude)
        expect(spot.location.coordinates[1]).to.be.a('number')
        expect(spot.modalities).to.be.an('array')
        expect(spot.modalities).to.deep.equal(modalities)
        expect(spot.tags).to.be.an('array')
        expect(spot.tags).to.deep.equal(tags)
        expect(spot.flag).to.be.an('object')
        expect(spot.flag.fountain).to.deep.equal(flags.fountain)
        expect(spot.flag.supermarket).to.deep.equal(flags.supermarket)
        expect(spot.flag.publicTransport).to.deep.equal(flags.publicTransport)
        expect(spot.flag.parking).to.deep.equal(flags.parking)
    })


    it('should fail on incorrect creator, name, description, longitude, latitude, modalities, tags, flags, or expression type and content', () => {
        expect(() => registerSpot(1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerSpot(true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerSpot([])).to.throw(TypeError, ' is not a string')
        expect(() => registerSpot({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerSpot(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerSpot(null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerSpot('')).to.throw(ContentError, 'creator is empty or blank')
        expect(() => registerSpot(' \t\r')).to.throw(ContentError, 'creator is empty or blank')

        expect(() => registerSpot(creator, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerSpot(creator, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerSpot(creator, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerSpot(creator, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerSpot(creator, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerSpot(creator, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerSpot(creator, '')).to.throw(ContentError, 'name is empty or blank')
        expect(() => registerSpot(creator, ' \t\r')).to.throw(ContentError, 'name is empty or blank')

        expect(() => registerSpot(creator, spotname, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerSpot(creator, spotname, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerSpot(creator, spotname, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerSpot(creator, spotname, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerSpot(creator, spotname, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerSpot(creator, spotname, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerSpot(creator, spotname, '')).to.throw(ContentError, 'description is empty or blank')
        expect(() => registerSpot(creator, spotname, ' \t\r')).to.throw(ContentError, 'description is empty or blank')

        expect(() => registerSpot(creator, spotname, description, 'abc')).to.throw(TypeError, 'abc is not a number')
        expect(() => registerSpot(creator, spotname, description, true)).to.throw(TypeError, 'true is not a number')
        expect(() => registerSpot(creator, spotname, description, [])).to.throw(TypeError, ' is not a number')
        expect(() => registerSpot(creator, spotname, description, {})).to.throw(TypeError, '[object Object] is not a number')

        expect(() => registerSpot(creator, spotname, description, longitude, 'abc')).to.throw(TypeError, 'abc is not a number')
        expect(() => registerSpot(creator, spotname, description, longitude, true)).to.throw(TypeError, 'true is not a number')
        expect(() => registerSpot(creator, spotname, description, longitude, [])).to.throw(TypeError, ' is not a number')
        expect(() => registerSpot(creator, spotname, description, longitude, {})).to.throw(TypeError, '[object Object] is not a number')
    
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, 1)).to.throw(TypeError, '1 is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, true)).to.throw(TypeError, 'true is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, 'abc')).to.throw(TypeError, 'abc is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, {})).to.throw(TypeError, '[object Object] is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, undefined)).to.throw(TypeError, 'undefined is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, null)).to.throw(TypeError, 'null is not a Array')

        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, 1)).to.throw(TypeError, '1 is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, true)).to.throw(TypeError, 'true is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, 'abc')).to.throw(TypeError, 'abc is not a Array')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, {})).to.throw(TypeError, '[object Object] is not a Array')

        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, tags, 1)).to.throw(TypeError, '1 is not a Object')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, tags, true)).to.throw(TypeError, 'true is not a Object')
        expect(() => registerSpot(creator, spotname, description, longitude, latitude, modalities, tags, 'abc')).to.throw(TypeError, 'abc is not a Object')

    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(database.disconnect))
})
