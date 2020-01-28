import React, { useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logic, { images } from '../../logic'
import MyContext from '../ProviderContext'
// import Feedback from '../Feedback'

export default withRouter(function ({ history, idSpot }) {
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

        onUpdate(name, description, tagsArr, modalities)
    }
    async function handleSaveImage (event) {
        event.preventDefault()
        
        const {file:  {files: [image]}} =  event.target
        const { token } = sessionStorage
        try {
            await logic.images(token, idSpot, image, 'spots')
            history.push(`/detail/${idSpot}`)
        } catch (error) {
            console.log(error)
        }
    }


    async function onUpdate(name, description, tagsArr, modalities) {
        try {
            const { token } = sessionStorage;
            await logic.spots.createSpot(token, name, description, tagsArr, modalities)
            history.push(`/detail/${idSpot}`)

        } catch (error) {
            console.error(error)
        }
    }

    return <section className="update-spot">
        <form className="update-spot__form form"  onSubmit={handleSaveImage}>
            <h1 className="form__title">Modify Spot</h1>
            <input type="file" className="form__input-file" name="file"/>
            <button className="btn-submit save">Save</button>
        </form>
        {/* <form className="update-spot__form form" onSubmit={handleSubmit}>
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
            <button className="btn-submit">Update spot</button>
        </form> */}

        {/* {error && <Feedback message={error} />} */}
    </section>
})