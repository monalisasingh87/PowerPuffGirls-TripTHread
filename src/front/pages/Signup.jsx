import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { signUp } from '../fetch';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {store, dispatch} = useGlobalReducer();

    const handleClick = () => {
        signUp(email, password, dispatch);
    }

    useEffect(() => {
        if (store.isSignUpSuccessful) {
            navigate('/login')
        }
    }, [store.isSignUpSuccessful])

    return (
        <>
        <div className="" style={{  
                    position: "relative", 
                    backgroundImage: "url('src/front/assets/img/background2.jpg')",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                 }}>
            <div className="row p-5 mt-0">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <div className="card text-center p-3" 
                            style={{boxShadow: "0 6px 12px rgba(52, 29, 105, 0.1)",
                                    borderRadius: "10px"}}
                            >
                            <div className="card-header h2">
                                Sign Up Here!
                            </div>
                            <div className="card-body">
                                <div className="mb-3 mt-5">
                                    <input
                                    type='email'
                                    className='form-control-lg'
                                    placeholder='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    />
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <input
                                    type='password'
                                    placeholder='password'
                                    className='form-control-lg'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    />
                                </div>
                                <div>
                                    <button 
                                        className="btn btn-lg btn-primary m-4"
                                        onClick={handleClick}>Signup
                                    </button>
                                </div>
                        </div>
                      </div>
                    <div className="col-4"></div>
                </div>
            </div>  
        </div>
        </>
    );
}
