import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import logic, { user } from '../../logic'
import SpotsList from '../SpotsList'
import MyContext from '../ProviderContext'
// import Feedback from '../Feedback'

export default withRouter(function ({ history }) {
    const  [error, setError]  = useState()
    
    const { user, spots, setSpots, refresh, setRefresh } = useContext(MyContext)

    useEffect(() => {
        (async () => {
            const { token } = sessionStorage;
            const spots = await logic.user.retrieveFavs(token)
            
            setSpots(spots)
        })()
    }, [refresh, setRefresh])

    return <section className="spots__container spots">
                <SpotsList spots={spots}/>
                {/* {error && <Feedback message={error} />} */}
            </section>
})