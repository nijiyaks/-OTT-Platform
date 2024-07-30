import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";
import backgroundImage from '../images/img3.jpg'; // Import the image

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [useremail, setUserEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function attemptLogin() {
        axios.post('http://localhost:8000/api/login', {
            username: username,
            email: useremail,
            password: password
        }).then(response => {
            console.log(response.data);
            const user = {
                username: username,
                userEmail: response.data.email,
                userId: response.data.id,
                token: response.data.token,
                userType: response.data.user_type,
            };
            dispatch(setUser(user));
            navigate("/listvideos");
        }).catch(error => {
            if (error.response && error.response.data.errors) {
                setErrorMessage(Object.values(error.response.data.errors).join(''));
            } else if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to login.please contact admin');
            }
        });
    }

    return (
        <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
           
            <div className="login-container">
                <h1>Login</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onInput={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onInput={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" onClick={attemptLogin}>Login</button>
                </div>
                <p>Dont have an account?  <Link to='/register'>Signup</Link></p>
            </div>
        </div>
    );
}

export default Login;
