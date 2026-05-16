import { Routes, Route, useNavigate } from 'react-router-dom'
// import Disclaimer from './pages/disclaimer'
import Lessons from './pages/lessons'
import Register from './pages/register'
import Login from './pages/login'
import Lesson1 from './pages/l1terminal'
import Lesson2 from './pages/l2terminal'
import Lesson3 from './pages/l3terminal'
import Lesson4 from './pages/l4terminal'
import Lesson5 from './pages/l5terminal'
import logo from './images/wic-logo.png'
import './App.css'

export default function App() {
  const navigate = useNavigate()
  const logoStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  } as const;

  return (
      <>
      <div style={logoStyle}>
        <a href="https://ucsdwic.github.io/" target="_blank" rel="noreferrer">
          <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }} />
        </a>
      </div>
      <Routes>
        <Route path="/" element={
          <div className="container">
          <h1>welcome to</h1>
          <h2>git-it!</h2>
          <br></br>
          <button onClick={() => navigate ('/disclaimer')}>start</button>
        </div>
        } />
        <Route path = "/disclaimer" element={<Lessons />} />
        <Route path = "/lessons" element={<Lessons />} />
        <Route path = "/register" element={<Register />} />
        <Route path = "/login" element={<Login />} />
        <Route path = "/lesson1" element={<Lesson1 />} />
        <Route path = "/lesson2" element={<Lesson2 />} />
        <Route path = "/lesson3" element={<Lesson3 />} />
        <Route path = "/lesson4" element={<Lesson4 />} />
        <Route path = "/lesson5" element={<Lesson5 />} />
      </Routes>
      </>
    )
  }

  // npm run dev
  // npm run build
  // npm run deploy