import call from '../../../utils/call' //eslint-disable-line
const { validate, errors: { NotFoundError, CredentialsError } } = require('flott-util')
const API_URL = process.env.REACT_APP_API_URL

export default function (idSpot, idUser) {

    return (async () => {
        
        const res = await call(`${API_URL}/spots/${idSpot}&${idUser}`, {
            method: 'GET'
        })

        if (res.status === 200) {
            const spots = JSON.parse(res.body)
            
            return spots
        }

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}