import React, { useState, useEffect, useContext }  from 'react'
import logic, { spots, user } from '../../logic'
import MyContext from '../ProviderContext'
// import './index.sass'

export default function ({user, idSpot}) {
    const [spot, setSpot] = useState(undefined)
    const { refresh, setRefresh } = useContext(MyContext)
    const { token } = sessionStorage;
   

    useEffect(() => {
        (async () => {
            try {
                await refreshSpot()
            } catch (error) {
                
            }
        })()
    }, [])

    async function refreshSpot(){
        let idUser
        user && user.id ? idUser = user.id : idUser = undefined
        
        const updatedSpot = await logic.spots.retrieveSpot(idSpot, idUser)
        
        setSpot(updatedSpot)
    }

    async function onFav(){
        try {
           if(token){
            await logic.user.toggleFav(token,spot.id)    
            await refreshSpot()
           }
        } catch (error) {
            
        }
    }

    return  <>
                { user && spot && (spot.isFav ? 
                    <button className="btn-fav" onClick={onFav}><i className="fas fa-heart"></i></button> :
                    <button className="btn-fav" onClick={onFav}><i className="far fa-heart"></i></button>)
                }
            </>
           
}