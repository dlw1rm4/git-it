import { useNavigate } from 'react-router-dom' 
import { useState } from 'react';
import './login.css'
import logoIcon from '../images/logo.png'

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <div className="login-page">
            <div className="logo-wrapper">
                <img src={logoIcon} alt="logo" className="logo-icon"></img>
                <span className="logo">git-it!</span>
            </div>
            <div className="container">
            <div className="login-container">
                <div className="login-header">
                <div className="red-dot"></div>
                <div className="header-text">Log in!</div>
                </div>
                <div className="login-box">
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
                        <button className="login-btn" onClick={() => navigate ('/login')}>Login</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}