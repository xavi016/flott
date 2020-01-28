import React, { useState, useEffect, useContext }  from 'react'
import logic, { spots, user } from '../../logic'
import ButtonFavorite from '../ButtonFavorite'
import { Link } from 'react-router-dom'
import MyContext from '../ProviderContext'
// import './index.sass'

export default function ({idSpot}) {
    const [spot, setSpot] = useState(undefined)
    const { user,setUser, refresh, setRefresh } = useContext(MyContext)
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
        
        const spot = await logic.spots.retrieveSpot(idSpot, idUser)
        
        setSpot(spot)
    }

    return  <>{spot  && <section className="spots__detail detail">
                <div className="detail__image">
                    <img src={spot.images.length > 0 ? `${spot.images[0]}?timestamp=${Date.now()}` :"images/default-images/spot.png"} alt="spot" className="img"/>
                    <div className="user__profile profile">
                        <img src={"images/default-images/user.png"} alt="user" className="profile__image"/>
                        <p className="profile__name">{spot.creatorUsername}</p>
                    </div>
                </div>
                <ul className="detail__tags tags">
                    {spot.tags.map(tag => <li key={tag} className="tags__item">{tag}</li>)}
                </ul>
                <p>Modalities</p>
                <ul className="detail__tags tags">
                    {spot.modalities.map(modaity => <li key={modaity} className="tags__item">{modaity}</li>)}
                </ul>
                <div className="detail__spot spot">
                    <h1 className="spot__name">{spot.name}<span className="spot__location">(Barcelona)</span></h1>                
                    <ButtonFavorite user={user} idSpot={idSpot}/>                    
                </div>
                <div className="detail__description description">
                    <p className="description__title">Description</p>
                    <p className="description__content">
                        {spot.description}
                    </p>
                </div>
                <div className="detail__extra">
                {user && <Link to={`/update-spot/${spot.id}`}  ><i className="far fa-edit"></i> Edit</Link>}
                    {/* <a href="#" className="url-maps"><i className="fas fa-map-marker-alt"></i> View in maps</a>
                    <button className="btn-info">More information</button> */}
                </div>
                {/* <div className="detail__comments comments">
                    <p className="comments__title">Comments</p>
                    <ul className="comments__list list">
                        <li className="list__item">
                            <div className="user__profile profile">
                                <img src={"images/default-images/user.png"} alt="user" className="profile__image"/>
                                <div className="item__data">
                                    <p className="profile__name">Cristian Vannella</p>
                                    <p className="date">12/11/2019</p>
                                </div>
                            </div>
                            <p className="user__comment">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum veritatis culpa dicta tempore nulla possimus, aliquam quia ducimus deleniti, laboriosam ab eius. Pariatur laborum labore, voluptatibus nihil voluptates modi fugit!
                            </p>
                        </li>
                    </ul>
                </div> */}
</section>}</>
           
}