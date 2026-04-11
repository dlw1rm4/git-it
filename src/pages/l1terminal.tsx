import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'

export default function Lesson1() {
    const navigate = useNavigate()

    return(
        <div className="l1-terminal-page">
            <div className="logo-wrapper">
                <img src={logoIcon} alt="logo" className="logo-icon"></img>
                <span className="logo">git-it!</span>
            </div>
            <div className="container">
                <div className="l1box-container">
                    <div className="l1box-header">
                        <div className="red-dot-btn">
                            <button className="red-dot-btn" onClick={() => navigate ('/lessons')}></button>
                        </div>
                    </div>
                    <div className="l1box">
                        <div className="terminal">
                            <p>random</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}