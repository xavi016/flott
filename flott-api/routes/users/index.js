const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, toggleFav, retrieveFavs } = require('../../logic/user')
const { uploadImage, loadImageUrl, loadImage } = require('../../logic/images')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const Busboy = require('busboy')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('flott-util')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, (req, res) => {
    
    const { body: { name, surname, email, username, password, modalities } } = req

    try {
        
        registerUser(name, surname, email, username, password, modalities)
            .then(() => res.status(201).end())
            .catch(error => {
                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { username, password } } = req

    try {
        authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '1d' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveUser(id)
            .then(user => res.json(user))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.get('/all', tokenVerifier, (req, res) => {
    try {
        const { id } = req

        retrieveUser(id)
            .then(user => res.json(user))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.get('/favorites', tokenVerifier, (req, res) => {
    
    try {
        const { id } = req
        retrieveFavs(id)
            .then(favorites => res.json(favorites))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.patch('/favs/:favId', tokenVerifier, jsonBodyParser, (req, res) => {
    
    try {
        const { id, params : {favId} } = req
        toggleFav(id, favId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })
                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/upload/:id', tokenVerifier, (req, res) => {
    
    const { params: { id } } = req
    const busboy = new Busboy({ headers: req.headers })
    const type = 'users'

    try {
        busboy.on('file', async(fieldname, file, filename, encoding, mimetype) => {
            filename = 'profile'
            await uploadImage(id, file, filename, type)
        })
    
        busboy.on('finish', () => {
            res.end("That's all folks!")
        })
    
        return req.pipe(busboy)
    } catch (error) {
        console.log(error)
    }
})

router.get('/retrieve-img/:id', tokenVerifier, async(req, res) => {

    const type = 'users'
    const { params: { id } } = req
    const stream = await loadImage(id, type)
    res.setHeader('Content-Type', 'image/jpeg')
    return stream.pipe(res)
})

router.get('/profile-imgUrl/:id', tokenVerifier, async(req, res) => {
    
    const type = 'users'
    const { params: { id } } = req
    const imageUrl = await loadImageUrl(id, type)
    res.json({ imageUrl })
})

module.exports = router