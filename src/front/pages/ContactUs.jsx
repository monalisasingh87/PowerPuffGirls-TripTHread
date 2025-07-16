import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react"
import { useEffect } from "react";

// import { ThreeScene } from '../components/ThreeScene'


export const ContactUs = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { store, dispatch } = useGlobalReducer();
    

    const [token, setToken] = useState("");
    const isLoggedIn = !!store.token; // 

    useEffect(() => {
        // Set token on component mount
        setToken(localStorage.getItem("token") || "");

    }, []);

    useEffect(() => {
        setIsSubmitted(false);
    }, [location.key]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            alert("Please enter a message");
            return;
        }
        try {
            const headers = {
                "Content-Type": "application/json",
            };
            if (isLoggedIn) {
                headers["Authorization"] = `Bearer ${store.token}`;
            }

            const body = isLoggedIn ? {
                content: message,
                // message_name: name,
            } :
                {
                    message_name: name,
                    message_email: email,
                    content: message,
                };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contactus`, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();
            setIsSubmitted(true);
            // navigate("/contactus");


        } catch (error) {
            console.error("Error during contact form submit:", error);
            alert('oops, something is not right..');
        }
    }

    return (

        <div className="bg-img" style={{ 
                    padding: "50px", 
                    position: "relative", 
                    backgroundImage: "url('src/front/assets/img/background2.jpg')",
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                 }}>
        <div className="contact-form pb-4" >
            <div className="glitter-circle"></div>
            <h1>Contact Us</h1>

            {isSubmitted ? (
                <p>Thank you for your patience, we will review and reach back to you in several days due to the volume!</p>
            ) : isLoggedIn ? (
                <>
                    <div className="form-name">
                        <label>Name:</label>
                        <input type="text" onChange={e => setName(e.target.value)} className="form-name-input" />
                    </div>
                    <div className="form-message mt-4">
                        <label>Message:</label>
                        <textarea rows="5" onChange={e => setMessage(e.target.value)} value={message} />
                    </div>
                    <div className="form-button text-center mt-4 mb-4">
                        <button className="submit" onClick={handleSubmit} style={{
              width: "auto",
              padding: "0.9rem",
              backgroundColor: "#c99404",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: 10,
              transition: "background 0.3s",
            }}>Submit</button>
                    </div>
                </>
            ) : (
                <>
                    <div className="form-name">
                        <label>Name:</label>
                        <input type="text" onChange={e => setName(e.target.value)} className="form-name-input" />
                    </div>
                    <div className="form-email mt-4">
                        <label>Email:</label>
                        <input type="email" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-message mt-4">
                        <label>Message:</label>
                        <textarea rows="5" onChange={e => setMessage(e.target.value)} value={message} />
                    </div>
                    <div className="form-button text-center mt-4">
                        <button className="submit" onClick={handleSubmit} >Submit</button>
                    </div>
                </>
            )}
        </div>
     </div>
    );

}