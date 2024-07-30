import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "../register.css";
import { Link } from "react-router-dom";
import backgroundImage from '../images/img3.jpg'; // Import the image

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const registerUser = (event) => {
        event.preventDefault(); // Prevent form submission
        // Check if passwords match
        if (password !== passwordConf) {
            setErrorMessage('Passwords do not match');
            return;
        }
        const userData = {
            username: name,
            email: email,
            password: password,
            phonenumber: phoneNumber,
        };

        axios.post('http://localhost:8000/api/signup', userData)
            .then(response => {
                setErrorMessage('');
                navigate('/login');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage('Failed to connect to API');
                }
            });
    };

    return (
      <div><Navbar />
        <div className="register-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
            
            <div className="register-container">
                <h1>Sign-up</h1>
                <form>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="form-group">
                        <label htmlFor="username">Name:</label>
                        <input 
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            id="username" 
                            name="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            className="form-control"
                            id="email" 
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone-number:</label>
                        <input 
                            type="tel" 
                            className="form-control"
                            id="phone" 
                            name="phone"
                            value={phoneNumber}
                            onChange={(event) => setPhoneNumber(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            className="form-control"
                            id="password" 
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpassword">Confirm-Password:</label>
                        <input 
                            type="password" 
                            className="form-control"
                            id="cpassword" 
                            name="cpassword"
                            value={passwordConf}
                            onChange={(event) => setPasswordConf(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={registerUser}>Sign-up</button>
                    </div>
                    <div className='spacing' style={{fontSize:14}}>Already have an account? <Link to={'/login'} style={{color:' #08264a'}}>Login</Link></div>
                </form>
            </div>
        </div></div>
    );
}

export default Register;
