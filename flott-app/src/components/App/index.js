import React, { useState, useEffect } from 'react';
import './index.sass'
import Menu from '../Menu'
import Search from '../Search'
import Home from '../Home'
import DetailSpot from '../DetailSpot'
import CreateSpot from '../CreateSpot'
import ModifySpot from '../ModifySpot'
import FavoritesList from '../FavoritesList'
import Register from '../Register'
import Login from '../Login'
import Footer from '../Footer'
import { Route, withRouter, Redirect } from 'react-router-dom'
import logic, { user, retrieveUser } from '../../logic'
import MyContext from '../ProviderContext'

export default withRouter(function ({ history }) {
    const   [user, setUser] = useState(undefined)
    const   [spots, setSpots]  = useState()
    const   [refresh, setRefresh]  = useState(false)
    
    useEffect(() => {
        const { token } = sessionStorage;
        (async () => {
            if (token) {
                const user = await logic.user.retrieveUser(token)
                setUser(user)
            }
        })()
    }, [sessionStorage.token, setUser, setRefresh])

    function handleGoBack() { history.push('/') }

    function handleLogout() {
        sessionStorage.clear()
        setUser(undefined)

        handleGoBack()
    }
    

    return <MyContext.Provider value={{ user , setUser, setSpots, spots, setRefresh, refresh }}>  
                    <Menu onLogout={handleLogout}/>
                        <Route exact path="/" render={() =><><section className="spots__container spots"><Search/><Home/></section></>} />
                        <Route exact path="/favorites" render={() =><><section className="spots__container spots"><FavoritesList/></section></>} />
                        <Route path="/create" render={() =><><CreateSpot/></>} />
                        <Route path="/update-spot/:idSpot" render={({ match: { params: { idSpot } } }) => <ModifySpot idSpot={idSpot} />} />
                        <Route path="/detail/:idSpot" render={({ match: { params: { idSpot } } }) => <DetailSpot idSpot={idSpot} />} />
                        <Route path="/register" render={() => user ? <Redirect to="/" /> : <Register/>} />
                        <Route path="/login" render={() => user ? <Redirect to="/" /> : <Login/>} />
                {/* <Route path="/board" render={() => token ? <Board user={name} tasks={tasks} onLogout={handleLogout} onChangeTaskStatus={handleChangeTaskStatus} onNewTask={handleNewTask} /> : <Redirect to="/" />} /> */}
                    <Footer/>
          </MyContext.Provider>
})