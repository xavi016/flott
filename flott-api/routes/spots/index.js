const { Router } = require('express')
const { listSpots, retrieveSpot, createSpot } = require('../../logic/spot')
const { uploadImage, loadImageUrl, loadImage } = require('../../logic/images')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const Busboy = require('busboy')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('flott-util')

const jsonBodyParser = bodyParser.json()

const router = Router()


router.post('/', tokenVerifier, jsonBodyParser, (req, res) => {
    const { id,  body: { name, description, longitude, latitude, modalities, tags, flags }  } = req
    try {
        
        createSpot(creator = id, name, description, longitude, latitude, modalities, tags, flags)
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

router.get('/:idSpot&:idUser', (req, res) => {
    try {
        
        const { params : {idSpot, idUser} } = req

        retrieveSpot(idUser,idSpot)
            .then(spot => res.json(spot))
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

router.get('/:idUser', (req, res) => {
    try {
        const { params : {idUser} } = req
        listSpots(idUser)
            .then(spots => res.status(200).json(spots))
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
router.get('/search/:query&:idUser', (req, res) => {
    
    const { params: { query, idUser } } = req
    try {
        listSpots(idUser, undefined, undefined, query, undefined)
            .then(spots => res.status(200).json(spots))
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

router.patch('/upload/:id', tokenVerifier, (req, res) => {
    
    const { params: { id } } = req
    const busboy = new Busboy({ headers: req.headers })
    const type = 'spots'

    try {
        busboy.on('file', async(fieldname, file, filename, encoding, mimetype) => {
            filename = 'profile.png'
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

    const type = 'spots'
    const { params: { id } } = req
    const stream = await loadImage(id, type)
    res.setHeader('Content-Type', 'image/jpeg')
    return stream.pipe(res)
})

router.get('/profile-imgUrl/:id', tokenVerifier, async(req, res) => {
    
    const type = 'spots'
    const { params: { id } } = req
    const imageUrl = await loadImageUrl(id, type)
    res.json({ imageUrl })
})

module.exports = router