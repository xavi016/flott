import React, { useState, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import logic, { spots } from '../../logic'
import MyContext from '../ProviderContext'
// import Feedback from '../Feedback'

export default withRouter(function ({ history }) {
    const  [error, setError]  = useState()
    const { user, setSpots } = useContext(MyContext)

    function handleSubmit(event){
        event.preventDefault()
        const { search: { value: query  } } = event.target
        onSearch(query)
    }

    async function onSearch(query) {
        try {
            
            const listSpots = await handleSearch(query)
            setSpots(listSpots)
            
            // history.push('/')

        } catch (error) {
            console.error(error)
        }
    }

    async function handleSearch(query){
        let idUser
        user && user.id ? idUser = user.id : idUser = undefined
        const results = await logic.spots.searchSpots(query,idUser)
        return results
    }

    return <div className="spots__action-bar">
                <div className="filter">
                    <button className="btn-filter">
                        <i className="fas fa-sliders-h"></i>
                    </button>
                </div>
                <form action="" method="get" className="search" onSubmit={handleSubmit}>
                    <input type="search" name="search" className="input-search" placeholder="Search spot"/>
                    <button className="btn-search">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
})