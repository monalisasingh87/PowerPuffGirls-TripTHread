import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { signOut } from '../fetch';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {store, dispatch} = useGlobalReducer();

    const handleClick = () => {
        signOut(email, password, dispatch);
    }

    useEffect(() => {
        if (store.isSignUpSuccessful) {
            navigate('/login')
        }
    }, [store.isSignUpSuccessful])

    return (
        <>
            <div className="signup-page">
                <div>
                    <h1>Sign Up Here!</h1>
                </div>
                <div>
                    <input 
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type='password'
                        placeholder='Create a password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                        onClick={handleClick}
                        >Sign Up
                    </button>
                </div>
            </div>
        </>
    );
}
