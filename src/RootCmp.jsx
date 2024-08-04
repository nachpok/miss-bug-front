import { useState, useEffect } from 'react';
import { userService } from './services/user.service.js';

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'

export function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkLoggedInUser();
    }, []);

    async function checkLoggedInUser() {
        try {
            const loggedInUser = sessionStorage.getItem('loggedInUser');
            if (loggedInUser) {
                setUser(JSON.parse(loggedInUser));
            }
        } catch (error) {
            console.error('Failed to fetch logged-in user:', error);
        }
    }

    function onLogin(user) {
        setUser(user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    function onLogout() {
        setUser(null);
        sessionStorage.removeItem('loggedInUser');
        userService.logout();
    }

    function onSignup(user) {
        setUser(user);
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    return (
        <Router>
            <div className='main-app'>
                <AppHeader user={user} onLogout={onLogout} />
                <main className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/bug' element={<BugIndex user={user} />} />
                        <Route path='/bug/:bugId' element={<BugDetails />} />
                        <Route path='/about' element={<AboutUs />} />
                        <Route path='/login' element={<Login onLogin={onLogin} />} />
                        <Route path='/signup' element={<Signup onSignup={onSignup} />} />
                        {/* <Route path='*' element={<Page404 />} /> */}
                    </Routes>
                </main>
                <AppFooter />
                <UserMsg />
            </div>
        </Router>
    )
}
