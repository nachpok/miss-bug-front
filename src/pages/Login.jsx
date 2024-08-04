import { Input } from 'antd'
import { userService } from '../services/user.service';
import { useNavigate, Link } from 'react-router-dom';

export function Login({ onLogin }) {
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        userService.login(username, password).then((res) => {
            onLogin(res.data);
        }).then(() => {
            navigate('/');
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
        <section className='login-page'>
            <article className='login-container'>
                <h1 className='login-title'>Login</h1>
                <form className='login-form' onSubmit={handleSubmit}>
                    <Input type="text" placeholder="Username" className='login-input' />
                    <Input type="password" placeholder="Password" className='login-input' />
                    <div className='login-signup'>
                        No accoutn? <Link to="/signup" className='login-signup-link'>Signup</Link>
                    </div>
                    <button type="submit" className='login-button'>Login</button>
                </form>
            </article>
        </section>
    )
}