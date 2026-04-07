import { useNavigate } from 'react-router-dom'
import './disclaimer.css'
import logoIcon from '../images/logo.png'

export default function Disclaimer() {
  const navigate = useNavigate()

  return (
    <div className="disclaimer-page">
        <div className="logo-wrapper">
          <img src={logoIcon} alt="logo" className="logo-icon"></img>
          <span className="logo">git-it!</span>
        </div>
        <div className="container">
          <div className="pop-up-box-container">
            <div className="pop-up-box-header">
              <div className="red-dot"></div>
              <div className="header-text">Wait!</div>
            </div>
            <div className="pop-up-box">
              <div className="box-text">Would you like to create an account to save your progress? (If you don't, you will lose your progress!)</div>
              <div className="button-group">
                <button className="btn-sure" onClick={() => navigate ('/register')}>Sure!</button>
                <button className="btn-nah" onClick={() => navigate ('/lessons')}>Nah, we ball.</button>
              </div>
              <div className="login-link" onClick={() => navigate('/login')}>I already have an account.</div>
            </div>
          </div>
        </div>
    </div>
  )
}