require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const toggleFavs = require('.')
const { database, models: { User } } = require('flott-data')
const bcrypt = require('bcryptjs')

describe('logic- toggle favs', () => {
    before(() => database.connect(TEST_DB_URL))
    let id, name, surname, email, username, password, hash
    idFav = '5de2a988d1698e73a5664b1e'

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)

        await User.deleteMany()
        
        const user = await User.create({ name, surname, email, username, password: hash })
        userId = user.id
    })

    it ('should suceed on correct fav', async () => {
        
        const response = await toggleFavs(userId, idFav)
        expect(response).to.be.undefined
        user = await User.findById(userId)
        expect(user.favorites).to.be.an('array')
        expect(user.favorites).to.have.lengthOf(1)
        expect(user.favorites[0].toString()).to.deep.include(idFav)
        
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            user = await User.findById(userId)
            user.favorites.push(idFav)
            await user.save()
        })

        it ('should suceed on correct unfav', async () => {
        const response = await toggleFavs(userId, idFav)
            expect(response).to.be.undefined
            const user = await User.findById(userId)
            expect(user.favorites).to.be.an('array')
            expect(user.favorites).to.have.lengthOf(0)
        })
    })
    after(() => User.deleteMany().then(database.disconnect))
})