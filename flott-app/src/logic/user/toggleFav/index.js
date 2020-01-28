import call from '../../../utils/call' //eslint-disable-line
const { validate, errors: { ConflictError } } = require('flott-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Toggle Favorite
* 
* @param {string} token
* @param {string} idUser
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {status}  status 201
*/

export default function (token, idUser) {
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(idUser)
    validate.string.notVoid('idUser', idUser)

    return (async () => {
        const res = await call(`${API_URL}/users/favs/${idUser}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        })

        if (res.status === 200) return 
        
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}