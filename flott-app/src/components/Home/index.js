import React, { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logic, { spots } from '../../logic'
import SpotsList from '../SpotsList'
import MyContext from '../ProviderContext'
// import Feedback from '../Feedback'

export default withRouter(function ({ history }) {
    const  [error, setError]  = useState()
    
    const { user, spots, setSpots, refresh, setRefresh } = useContext(MyContext)

    useEffect(() => {
        (async () => {
            // const listSpots = await handleRetrieveSpots()
            let idUser
            user && user.id ? idUser = user.id : idUser = undefined
            const listSpots = await logic.spots.listSpots(idUser)
            setSpots(listSpots)
        })()
    }, [refresh])

    // async function handleRetrieveSpots(){
    //     let idUser
    //     user && user.id ? idUser = user.id : idUser = undefined
    //     const results = await logic.spots.listSpots(idUser)
    //     return results
    // }
    return <section className="spots__container spots">

                <SpotsList spots={spots}/>
                { user && <Link to="/create"  className="btn-add">
                    <i className="fas fa-plus"></i>
                </Link>}
                {/* {error && <Feedback message={error} />} */}
            </section>
})