import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logic, { spots } from '../../logic'
import MyContext from '../ProviderContext'
// import Feedback from '../Feedback'

export default withRouter(function ({ history }) {
    const  [error, setError]  = useState()
    const { setUser } = useContext(MyContext)

    function handleSubmit (event) {
        event.preventDefault()
        let modalities = []
        
        const { 
            name: { value: name },
            description: { value: description },
            tags: { value: tags }
        } = event.target

        let tagsArr = tags.replace(' ','').split(',')
        if(event.target.roller.checked) modalities.push('roller')
        if(event.target.skate.checked) modalities.push('skate')
        if(event.target.longboard.checked) modalities.push('longboard')
        if(event.target.scooter.checked) modalities.push('scooter')
        if(event.target.bmx.checked) modalities.push('bmx')

        onCreate(name, description, tagsArr, modalities)
    }

    async function onCreate(name, description, tagsArr, modalities) {
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }

        navigator.geolocation.getCurrentPosition(position => {
            let latitude = position.coords.latitude
            let longitude =  position.coords.longitude
        }, error => console.log(error.message), options)

        try {
            const { token } = sessionStorage;
            await logic.spots.createSpot(token, name, description, tagsArr, modalities)
            history.push('/')

        } catch (error) {
            console.error(error)
        }
    }

    return <section className="create-spot">
        <form className="create-spot__form form" onSubmit={handleSubmit}>
            <h1 className="form__title">Create Spot</h1>
            <input className="form__input" type="text" name="name" autoFocus placeholder="Name" />
            <textarea name="description" className="form__text-area" rows="6"
                    placeholder="Description"></textarea>
            <input className="form__input" name="tags" type="text" placeholder="Tags..."/>
            <p className="form__label">Modalities</p>
            <div className="form__diciplines">
                <label htmlFor="bmx"><input id="bmx" className="form__checkbox" type="checkbox" name="bmx" value="bmx"/>BMX</label>
                <label htmlFor="longboard"><input id="longboard" className="form__checkbox" type="checkbox" name="longboard" value="longboard"/>Longboard</label>
                <label htmlFor="scooter"><input id="scooter" className="form__checkbox" type="checkbox" name="scooter" value="scooter"/>Scooter</label>
                <label htmlFor="skate"><input id="skate" className="form__checkbox" type="checkbox" name="skate" value="skate"/>Skate</label>
                <label htmlFor="roller"><input id="roller" className="form__checkbox" type="checkbox" name="roller" value="roller"/>Roller</label>
            </div>
            <button className="btn-submit">Create</button>
        </form>

        {/* {error && <Feedback message={error} />} */}
    </section>
})