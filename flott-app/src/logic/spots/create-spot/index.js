import call from '../../../utils/call' //eslint-disable-line
const { validate, errors: { ConflictError } } = require('flott-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Create spot
* 
* @param {string} token
* @param {string} name 
* @param {string} description
* @param {Array} tags 
* @param {Array} modalities
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {status}  status 201
*/

export default function (token, name, description, tags, modalities) {
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(description)
    validate.string.notVoid('description', description)
    validate.array(tags)
    validate.array(modalities)

    return (async () => {
        const res = await call(`${API_URL}/spots`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, tags, modalities })
        })

        if (res.status === 201) return
        
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}