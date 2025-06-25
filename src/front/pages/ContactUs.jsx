import { useState } from "react"
// import { ThreeScene } from '../components/ThreeScene'


export const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const token = localStorage.getItem("token");
    const isLoggedIn = Boolean(token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                "Content-Type": "application/json",
            };
            if (isLoggedIn) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const body = isLoggedIn ? {
                content: message
            } :
                {
                    message_name: name,
                    message_email: email,
                    content: message,
                };

            const response = await fetch("https://organic-cod-wr5x4jj5944636q6-3001.app.github.dev/api/contactus", {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();
            setIsSubmitted(true);


        } catch (error) {
            console.error("Error during contact form submit:", error);
            alert('oops, something is not right..');
        }
    }

    return (

        // <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        //     {/* Background 3D scene */}
        //     <div style={{
        //         position: 'absolute',
        //         top: 30,
        //         left: 30,
        //         width: '40%',
        //         height: '40%',


        //     }}>
        //         <ThreeScene />
        //     </div>


            <div className="contact-form">

                <h1>Contact Us</h1>
                {isSubmitted ?
                    (<p>Thank you for your patience, we will review and reach back to you in serval days due to the amount!</p>) :

                    (
                        <>
                            <div className="form-name mt-4">
                                <label htmlFor="">Name:</label>
                                <input type="text" onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-email mt-4">
                                <label htmlFor="">Email:</label>
                                <input type="email" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-message mt-4">
                                <label htmlFor="">Message:</label>
                                <textarea rows="5" onChange={e => setMessage(e.target.value)} value={message} />
                            </div>
                            <div className="form-button text-center mt-4">
                                <button className="submit"
                                    onClick={handleSubmit}
                                >Submit</button>
                            </div>
                        </>
                    )}
            </div>

        // </div>
    )
}