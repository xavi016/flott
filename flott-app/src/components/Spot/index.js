import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import MyContext from '../ProviderContext'
import ButtonFavorite from '../ButtonFavorite'

export default function ({ spot: { id, images, username, name, totalFavs, tags, isFav } }) {
    
    const { user } = useContext(MyContext)

    return  <>
                <div className="card__image">
                        <img src={images.length > 0 ? `${images[0]}?timestamp=${Date.now()}` :"images/default-images/spot.png"} alt="spot" className="img"/>
                        <Link to={`detail/${id}`} className="more-info">More info</Link>
                    </div>
                <ul className="card__tags tags">
                    {tags.map(tag => <li key={tag} className="tags__item">{tag}</li>)}
                </ul>
                <div className="card__header">
                    <a className="#"href="#" className="url-maps"><i className="fas fa-map-marker-alt"></i></a>
                    <h1 className="spot-name">{name}</h1>
                    <p className="spot-location">(Barcelona)</p>
                    <ButtonFavorite user={user} idSpot={id} />
                </div>
                <div className="card__social social">
                    <div className="social__last-comment">
                        {/* <img src={"images/default-images/user.png"} alt="user" className="user-image"/>
                        <p className="user-comment">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        </p>
                        <p className="date">12/11/2019</p> */}
                    </div>
                    <p className="social__total-likes">
                       
                    </p>
                    <p className="social__total-comments">
                        {/* <i className="far fa-comment-alt"></i> 84 */}
                    </p>
                </div>
            </>
           
}