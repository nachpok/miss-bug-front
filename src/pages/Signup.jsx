import { useState } from 'react';
import { Input } from 'antd'
import { userService } from '../services/user.service';
import { useNavigate } from 'react-router-dom';

export function Signup({ onSignup }) {
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const fullname = e.target.fullname.value;
        const password = e.target.password.value;

        console.log("Singup.jsx", username, password, fullname);


        if (username && password && fullname) {
            try {
                const res = await userService.signup({ username, password, fullname });
                if (res.status === 201) {
                    onSignup(res.data);
                    navigate('/');
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <section className='signup-page'>
            <article className='signup-container'>
                <h1 className='signup-title'>Signup</h1>
                <form className='signup-form' onSubmit={handleSubmit}>
                    <Input type="text" placeholder="Username" className='signup-input' name="username" />
                    <Input type="text" placeholder="Full Name" className='signup-input' name="fullname" />
                    <Input type="password" placeholder="Password" className='signup-input' name="password" />
                    <button type="submit" className='signup-button'>Signup</button>
                </form>
                {/* {error && <p className='signup-error'>{error}</p>} */}
            </article>
        </section>
    )
}