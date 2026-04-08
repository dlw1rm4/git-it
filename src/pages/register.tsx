import { useNavigate } from 'react-router-dom' 
import { useState } from 'react';
import './register.css'
import logoIcon from '../images/logo.png'

export default function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <div className="register-page">
            <div className="logo-wrapper">
                <img src={logoIcon} alt="logo" className="logo-icon"></img>
                <span className="logo">git-it!</span>
            </div>
            <div className="container">
            <div className="register-container">
                <div className="register-header">
                <div className="red-dot"></div>
                <div className="header-text">Sign Up!</div>
                </div>
                <div className="register-box">
                    <div className="box-text">Username</div>
                    <input
                        type="text"
                        className="username-input"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="box-text">Password</div>
                    <input
                        type="text"
                        className="password-input"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="button-group">
                        <button className="signup-btn" onClick={() => navigate ('/register')}>Create</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}