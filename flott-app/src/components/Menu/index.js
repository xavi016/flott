import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import MyContext from '../ProviderContext'

export default function({ onLogout }) {
    const [toggleMenu, setToggleMenu] = useState(false)
    const { user,refresh, setRefresh } = useContext(MyContext)
    function onToggleMenu() {
        setToggleMenu(!toggleMenu)        
    }
    function refreshSpots(){
        setRefresh(!refresh)
        onToggleMenu()
    }

    return <header className="header">
    <input id="show-menu" name="modal" type="checkbox"/>
    <i onClick={onToggleMenu} className="fas fa-bars hamburger__icon"></i>
    <Link to="/" className="logo"><img src="/images/flott.png" alt="Flott" className="logo__img"/></Link>
    <nav className={toggleMenu ? 'header__nav nav-show' : 'header__nav nav'}>
        <ul className="nav__menu menu">
            <span>
                { user && <li className="menu__item"><Link to="/" className="logo">{user.username}</Link></li> }
                <li className="menu__item"><Link to="/" onClick={refreshSpots} className="logo">Spots</Link></li>
                {/* <li className="menu__item">News</li>
                <li className="menu__item"><Link to="/" onClick={onToggleMenu} className="logo">Maps</Link></li> */}
                { user && <li className="menu__item"><Link to="/favorites" onClick={refreshSpots} className="logo">Favorites</Link></li> }
                { user && <li className="menu__item">
                    <form onSubmit={event => { event.preventDefault(); onLogout() }}>
                        <button className="btn__logout">Logout</button>
                    </form>
                </li> }
            </span>
            {!user && <li className="menu__item access">
                    <Link to="/register" onClick={onToggleMenu} className="logo">Sing In</Link> | 
                    <Link to="/login" onClick={onToggleMenu} className="logo">Log In</Link>
            </li> }
        </ul>
    </nav>
</header>
}