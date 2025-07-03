import { useState, useEffect, useSyncExternalStore } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { login } from "../fetch";


export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const [loginAttempted, setLoginAttempted] = useState(false); // NEW


    const handleClick = () => {
       // e.preventDefault(); // ← prevent form reload
       // setLoginAttempted(true);
        login(email, password, dispatch)
    }

    useEffect(() => {
       // if (!loginAttempted) return; // NEW: Avoid triggering on first render

       // console.log("Login attempted. Success?", store.isLoginSuccessful);


       // if (store.isLoginSuccessful === false) {
          //  alert("Email o password incorrect, please try again");
       // }
       // else
        if (store.isLoginSuccessful) {
            navigate('/homepage')
        }
    }, [store.isLoginSuccessful])

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
            <div className="text-center">
                {
                (store.token && store.token !== undefined && store.token !== "")
                ? 
                <h1>You are already logged in</h1>
                : 
                <>
                <div className="row p-5">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <div class="card cardLogin p-3" 
                            style={{boxShadow: "0 6px 12px rgba(52, 29, 105, 0.1)",
                                    borderRadius: "10px"}}
                            >
                            <div class="card-header h2">
                                Login
                            </div>
                            <div class="card-body">
                                {/* 🔴 Alert for failed login */}
                                {loginError && (
                                    <div className="alert alert-danger" role="alert">
                                    Email or password is incorrect. Please try again.
                                    </div>
                                )}
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
                                        onClick={handleClick}>Login
                                    </button>
                                </div>
                        </div>
                        </div>
                        <div className="col-4"></div>
                    </div>
                </div>  
                        </>
                }
            </div>

        </div>

        </>

        
    
    );
}

