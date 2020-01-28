require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const authenticateUser = require('.')
const { random } = Math
const { errors: { ContentError, CredentialsError } } = require('flott-util')
const { database, models: { User } } = require('flott-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, username, password, hash, modalities

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)
        modalities = ['skate', 'roller']
        await User.deleteMany()

        const user = await User.create({ name, surname, email, username, password: hash, modalities })

        id = user.id
    })

    it('should succeed on correct credentials', async () => {
        const userId = await authenticateUser(username, password)

        expect(userId).to.exist
        expect(typeof userId).to.equal('string')
        expect(userId.length).to.be.greaterThan(0)

        expect(userId).to.equal(id)
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong username', async () => {
            const username = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal(`wrong credentials`)
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(CredentialsError)

                const { message } = error
                expect(message).to.equal(`wrong credentials`)
            }
        })
    })

    it('should fail on incorrect username, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).to.throw(ContentError, 'username is empty or blank')
        expect(() => authenticateUser(' \t\r')).to.throw(ContentError, 'username is empty or blank')

        expect(() => authenticateUser(username, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => authenticateUser(username, true)).to.throw(TypeError, 'true is not a string')
        expect(() => authenticateUser(username, [])).to.throw(TypeError, ' is not a string')
        expect(() => authenticateUser(username, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(username, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(username, null)).to.throw(TypeError, 'null is not a string')

        expect(() => authenticateUser(username, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(username, ' \t\r')).to.throw(ContentError, 'password is empty or blank')
    })

    after(() => User.deleteMany().then(database.disconnect))
})
