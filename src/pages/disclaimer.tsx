import { useNavigate } from 'react-router-dom'
import './disclaimer.css'

export default function Disclaimer() {
  const navigate = useNavigate()

  return (
    <div className="disclaimer-page">
        <p className="logo">git-it!</p>
        <div className="container">
            <button onClick={() => navigate ('/lessons')}>start</button>
        </div>
    </div>
  )
}