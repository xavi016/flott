require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const updateUser = require('.')
const { random } = Math
const { errors: { NotFoundError, ConflictError, ContentError }, polyfills: { arrayRandom } } = require('flott-util')
const { database, ObjectId, models: { User, Socialmedia } } = require('flott-data')
const bcrypt = require('bcryptjs')

describe('logic - update user', () => {
    
    before(() => database.connect(TEST_DB_URL))

    let id, name, surname, email, username, password, description, modalities, media, hash

    beforeEach(async () => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = `password-${random()}`
        hash = await bcrypt.hash(password, 10)
        description = `description-${random()}`
        modalities = ['skate']
        media = {
            name: 'instagram',
            link: `media-${random()}`
        }

        await User.deleteMany()

        const user = await User.create({ name, surname, email, username, password: hash })
        const mediaObj = await new Socialmedia(media)

        user.socialMedia.push(mediaObj)
        await user.save()
        id = user.id

    })

    it('should succeed on correct update user', async () => {
        const newName = `new-name-${random()}`
        const newSurname = `new-surname-${random()}`
        const newEmail = `new-email-${random()}@mail.com`
        const newUsername = `new-username-${random()}`
        let newPassword = `new-password-${random()}`
        newPassword = await bcrypt.hash(newPassword, 10)
        const newDescription = `new-description-${random()}`
        const newModalities = ['longboard']
        const newMedia = {
            name: 'instagram',
            link: `media.com/-${random()}`
        }
        const newMediaObj = new Socialmedia(newMedia)
        const response = await updateUser(id, newName, newSurname, newUsername, newEmail, newPassword, newDescription, newModalities, newMediaObj)
        expect(response).to.not.exist

        const user = await User.findById(id)   
        expect(user.id).to.equal(id)

        expect(user.name).to.exist
        expect(user.name).to.be.a('string')
        expect(user.name).to.have.length.greaterThan(0)
        expect(user.name).to.equal(newName)

        expect(user.surname).to.exist
        expect(user.surname).to.be.a('string')
        expect(user.surname).to.have.length.greaterThan(0)
        expect(user.surname).to.equal(newSurname)

        expect(user.email).to.exist
        expect(user.email).to.be.a('string')
        expect(user.email).to.have.length.greaterThan(0)
        expect(user.email).to.equal(newEmail)

        expect(user.username).to.exist
        expect(user.username).to.be.a('string')
        expect(user.username).to.have.length.greaterThan(0)
        expect(user.username).to.equal(newUsername)

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        expect(user.password).to.equal(newPassword)

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.modalities).to.exist
        expect(user.modalities).to.be.an('array')
        expect(user.modalities).to.have.length.greaterThan(0)
        expect(user.modalities).to.deep.equal(newModalities)

        expect(user.socialMedia).to.exist
        expect(user.socialMedia).to.be.an('array')
        expect(user.socialMedia).to.have.length.greaterThan(0)
        expect(user.socialMedia[0].url).to.equal(newMedia.url)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)
    })

    it('should succeed on correct update user, except for name', async () => {
        const newSurname = `new-surname-${random()}`
        const newEmail = `new-email-${random()}@mail.com`
        const newUsername = `new-username-${random()}`
        let newPassword = `new-password-${random()}`
        newPassword = await bcrypt.hash(newPassword, 10)
        const newDescription = `new-description-${random()}`
        const newModalities = ['longboard']
        const newMedia = {
            name: 'instagram',
            link: `media.com/-${random()}`
        }
        const newMediaObj = new Socialmedia(newMedia)
        const { name } = await User.findById(id)
        const response = await updateUser(id, undefined, newSurname, newUsername, newEmail, newPassword, newDescription, newModalities, newMediaObj)
        expect(response).to.not.exist

        const user = await User.findById(id)   
        expect(user.id).to.equal(id)

        expect(user.name).to.exist
        expect(user.name).to.be.a('string')
        expect(user.name).to.have.length.greaterThan(0)
        expect(user.name).to.equal(name)

        expect(user.surname).to.exist
        expect(user.surname).to.be.a('string')
        expect(user.surname).to.have.length.greaterThan(0)
        expect(user.surname).to.equal(newSurname)

        expect(user.email).to.exist
        expect(user.email).to.be.a('string')
        expect(user.email).to.have.length.greaterThan(0)
        expect(user.email).to.equal(newEmail)

        expect(user.username).to.exist
        expect(user.username).to.be.a('string')
        expect(user.username).to.have.length.greaterThan(0)
        expect(user.username).to.equal(newUsername)

        expect(user.password).to.exist
        expect(user.password).to.be.a('string')
        expect(user.password).to.have.length.greaterThan(0)
        expect(user.password).to.equal(newPassword)

        expect(user.description).to.exist
        expect(user.description).to.be.a('string')
        expect(user.description).to.have.length.greaterThan(0)
        expect(user.description).to.equal(newDescription)

        expect(user.modalities).to.exist
        expect(user.modalities).to.be.an('array')
        expect(user.modalities).to.have.length.greaterThan(0)
        expect(user.modalities).to.deep.equal(newModalities)

        expect(user.socialMedia).to.exist
        expect(user.socialMedia).to.be.an('array')
        expect(user.socialMedia).to.have.length.greaterThan(0)
        expect(user.socialMedia[0].url).to.equal(newMedia.url)

        expect(user.lastAccess).to.exist
        expect(user.lastAccess).to.be.an.instanceOf(Date)
    })

    it('should fail on unexisting user', async () => {
        const id = ObjectId().toString()
        const newName = `new-name-${random()}`
        const newSurname = `new-surname-${random()}`
        const newEmail = `new-email-${random()}@mail.com`
        const newUsername = `new-username-${random()}`
        let newPassword = `new-password-${random()}`
        newPassword = await bcrypt.hash(newPassword, 10)
        const newDescription = `new-description-${random()}`
        const newModalities = ['longboard']
        const newMedia = {
            name: 'instagram',
            link: `media.com/-${random()}`
        }
        const newMediaObj = new Socialmedia(newMedia)

        try {
            await updateUser(id, newName, newSurname, newUsername, newEmail, newPassword, newDescription, newModalities, newMediaObj)

            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${id} not found`)
        }
    })

    after(() => User.deleteMany().then(database.disconnect))
})