require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const listSpots = require('.')
const { errors: { NotFoundError }, polyfills: { shuffle } } = require('flott-util')
const { database, ObjectId, models: { Spot, User } } = require('flott-data')
const bcrypt = require('bcryptjs')
const randomCoordinates = require('random-coordinates')

describe('logic - retrieve spots', () => {
    
    before(() => database.connect(TEST_DB_URL))

    let id, _name, surname, email, username, password
    let spotname, description, longitude, latitude, spotModalities
    let userCoordinates, radius, spotName, sports, spotTags
    const insertions = []
    const spotsName = []

    beforeEach(async() => {
        
        _name = `Cerdo-${random()}`
        surname = `Gordo-${random()}`
        email = `Email-${random()}@mail.com`
        username = `Username-${random()}`
        password = `Password-${random()}`
        hash = await bcrypt.hash(password, 10)
        
        await Promise.all([User.deleteMany(), Spot.deleteMany()])

        const user = await User.create({ name: _name, surname, email, username, password: hash })
        id = user.id

        for (let i = 0; i < 10; i++) {

            let coor = [41 + random(), 2 + random()]
            latitude = coor[1]
            longitude = coor[0]
            spotName = `spotname-${random()}`
            spotModalities = ['skate','longboard','roller','scooter','bmx']
            const numItems = floor(random() * spotModalities.length)
            spotModalities = spotModalities.shuffle().splice(0, numItems)

            const spot = {
                creator: id,
                name: spotName,
                description: `description-${random()}`,
                location: { type: "Point", coordinates: [longitude, latitude] },
                modalities: spotModalities,
                tags: ['random', 'skate', 'word'],
                flag: {
                        fountain: false,
                        supermarket: false,
                        publicTransport: false,
                        parking: true
                    }
            }
            spotsName.push(spotName)
            insertions.push(spot)
        }

        await Spot.insertMany(insertions)

    })

    it('should succeed on correct retrieve collecting elements according to filter', async () => {
        // userCoordinates = [41+random(),2+random()]
        // radius = 130000
        // spotName = 'Lukazhu'
        // sports = ['skate','longboard']
        // spotTags = ['random']
        // query = " "

        const spots = await listSpots(id)
        
        expect(spots).to.exist
        expect(spots).to.be.an("array")
        
        spots.forEach(spot => {
            expect(spot.name).to.exist
            expect(spot.name).to.be.a('string')
            expect(spot.name).to.be.oneOf(spotsName)
            expect(spot.tags).to.exist
            expect(spot.tags).to.be.an('array')
            expect(spot.modalities).to.exist
            expect(spot.modalities).to.be.an('array')
            expect(spot.images).to.exist
            expect(spot.images).to.be.an('array')
            expect(spot.totalFavs).to.exist
            expect(spot.totalFavs).to.be.a('number')
            expect(spot.username).to.exist
            expect(spot.username).to.be.a('string')
            expect(spot.userImage).to.be.undefined
        });
    })

    after(() => Promise.all([User.deleteMany(), Spot.deleteMany()]).then(database.disconnect))
})
