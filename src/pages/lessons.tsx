import { useNavigate } from 'react-router-dom'
import './lessons.css'

const lessons = [
    {
        id: 1,
        commit: 'Commit 1',
        title: 'What is Git?',
        progress:0,
    }
]
export default function Lessons() {
    const navigate = useNavigate()

    return (
        <div className="lessons-page">
            <p className="logo">git-it!</p>

            <div className="lessons-container">
                <div className="header-card">
                    <h1>Git Started!</h1>
                </div>

                <div className="arrow">↓</div>

                {lessons.map((lesson) => (
                    <div className="lesson-card" key={lesson.id}>
                        <div className="lesson-card-header">
                            <p>{lesson.commit}</p>
                        </div>
                        <div className="lesson-card-body">
                            <p className="lesson-title">{lesson.title}</p>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: '${lesson.progress}%' }}
                                />
                        </div>
                        <button onClick={() => navigate('/terminal')}>start</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}