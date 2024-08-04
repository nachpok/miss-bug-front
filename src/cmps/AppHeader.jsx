
import { NavLink } from 'react-router-dom'

export function AppHeader({ user, onLogout }) {

    return (
        <header className='app-header container'>

            <div className='header-container'>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink>
                    |
                    <NavLink to="/bug">Bugs</NavLink>
                    |
                    <NavLink to="/about">About</NavLink>
                    {!user &&
                        <>
                            |
                            <NavLink to="/login">Login</NavLink>
                        </>
                    }
                    {user &&
                        <>
                            |
                            <NavLink to="/" onClick={onLogout}>Logout</NavLink>
                        </>
                    }
                    {user &&
                        <>
                            |
                            <NavLink to="/profile">{user.fullname}</NavLink>
                        </>
                    }
                </nav>
                <h1>Bugs are Forever</h1>
            </div>
        </header>
    )
}
