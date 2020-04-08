import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Signup from './pages/User/SignUp'
import Signin from './pages/User/SignIn'
import Dashboard from './pages/Dashboard'
import Download from './pages/Download'
import Profile from './pages/User/Profile'

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/signup" exact component={ Signup } />
                <Route path="/signin" exact component={ Signin } />
                <Route path="/profile" exact component={ Profile } />
                <Route path="/dashboard" exact component={ Dashboard } />
                <Route path="/download/:id" exact component={ Download } />
            </Switch>
        </BrowserRouter>
    )
}