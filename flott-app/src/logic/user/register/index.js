import call from '../../../utils/call' //eslint-disable-line
const { validate, errors: { ConflictError } } = require('flott-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Register user
* 
* @param {string} name
* @param {string} surname 
* @param {string} email
* @param {string} username
* @param {string} password 
* @param {string} modalities
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {status}  status 201
*/

export default function (name, surname, email, username, password, modalities) {
    validate.string(name)
    validate.string.notVoid('name', name)
    validate.string(surname)
    validate.string.notVoid('surname', surname)
    validate.string(email)
    validate.string.notVoid('e-mail', email)
    validate.email(email)
    validate.string(username)
    validate.string.notVoid('username', username)
    validate.string(password)
    validate.string.notVoid('password', password)
    validate.array(modalities)
    // validate.matches('modalities', modalities, 'bmx','skate', 'longboard','roller','scooter')

    return (async () => {
        const res = await call(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, username, password, modalities })
        })

        if (res.status === 201) return
        
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}