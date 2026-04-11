import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState } from 'react'
import confetti from 'canvas-confetti'; 
import { useEffect } from 'react';

export default function Lesson1() {
    const navigate = useNavigate()
    const [pageIndex, setPageIndex] = useState(0)

    const pages = [
        {
            title: "Commit 1: What is Git?",
            text: "According to the Wikipedia, Git is a distributed version control software system that is capable of managing versions of source code or data. It is often used to control source code by programmers who are developing software collaboratively.\n\nIf you understood that, congrats! You're smarter than me :D !\n\nIf not, don't worry! Say you're playing a video game and reach a difficult dungeon. There's a good chance you might die, so before you enter the dungeon, you save your game. Git is basically a saving point for your project."
        },
        {
            title: "Commit 1A: Create a repository",
            text: "Let's start with something simple. A repository is a place where we store our project's code and history. We'll try creating a repository locally using the terminal on the right.\n\nTo do this, type 'git init' in the terminal."
        },
        {
            title: "Commit 1: What is Git?",
            text: "test2"
        }
    ]

    const handleNext = () => {
        if (pageIndex < pages.length - 1)
        {
            setPageIndex(pageIndex + 1)
        } 
        else 
        {
            confetti({
                particleCount: 150,
                spread: 70,
                colors: ['#ffcdb2', '#B5828C', '#E5989B'],
                zIndex: 999
            });

            setTimeout(() => {
                navigate('/lessons');
            }, 3000); 
        }
    }

    const handleBack = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    };

    useEffect(() => {
        const scrollContainer = document.querySelector('.l1box-content');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        }
    }, [pageIndex]);

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
                        <div className="l1box-content">
                            <h1 className="l-title">{pages[pageIndex].title}</h1>
                            <p className="l-text">{pages[pageIndex].text}</p>

                            <div className="button-row">
                                {pageIndex > 0 ? (
                                    <button className="back-btn" onClick={handleBack}>{"<"}</button>
                                ) : (
                                    <div className="spacer"></div>
                                )}
                                <button className="next-btn" onClick={handleNext}>
                                    {pageIndex === pages.length - 1 ? "FINISH" : ">"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="terminal">
                        <p>random</p>
                    </div>
                </div>
            </div>
        </div>
    )
}