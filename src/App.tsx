import { Routes, Route, useNavigate } from 'react-router-dom'
import Disclaimer from './pages/disclaimer'
import Lessons from './pages/lessons'
import Register from './pages/register'
import Login from './pages/login'
import Lesson1 from './pages/l1terminal'
import './App.css'

export default function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={
        <div className="container">
        <h1>welcome to</h1>
        <h2>git-it!</h2>
        <br></br>
        <button onClick={() => navigate ('/disclaimer')}>start</button>
      </div>
      } />
      <Route path = "/disclaimer" element={<Disclaimer />} />
      <Route path = "/lessons" element={<Lessons />} />
      <Route path = "/register" element={<Register />} />
      <Route path = "/login" element={<Login />} />
      <Route path = "/lesson1" element={<Lesson1 />} />
    </Routes>
  )
}

// npm run dev
// npm run build
// npm run deploy