import { Routes, Route, useNavigate } from 'react-router-dom'
import Lessons from './pages/lessons'
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
        <button onClick={() => navigate ('/lessons')}>start</button>
      </div>
      } />
      <Route path = "/lessons" element={<Lessons />} />
    </Routes>
  )
}