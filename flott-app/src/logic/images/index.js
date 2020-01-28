const { validate, errors: { ConflictError } } = require('flott-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Upload image
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

export default function (token, id, image, type) {
    let fData = new FormData()
    fData.append('image', image)
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(id)
    validate.string.notVoid('id', id)
    validate.string(type)
    validate.string.notVoid('type', type)
    
    return (async () => {
        const res = await fetch(`${API_URL}/${type}/upload/${id}`, {
            method: 'PATCH',
            headers: { 
                Authorization: `Bearer ${token}`
            },
            body: fData
        })
        
        if (res.status === 200) return

        throw new Error(JSON.parse(res.body).message)
    })()
}