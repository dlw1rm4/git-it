import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Terminal from './terminal'

const pages = [
    {
        title: "Commit 5: Viewing History",
        text: "So far, we’ve seen a lot about commits, but how can we see the history of them?\n\nIn Lesson 3, we learned about the <b>git status</b> command, which helps us find out what branch we’re on, unstaged/staged changes, and whether we’re behind or ahead of our current branch.\n\nNow, let’s learn a new command: <b>git diff</b>.\n\nThis helps us see the exact line-by-line changes between your working files and the last commit, or between two branches.\n\nTry it out!"
    },
    {
        title: "Commit 5A: git diff",
        text: "<b>git diff</b> is a great command for checking what’s different about your code before committing.\n\nIt shows you exactly what lines were added, removed, or changed.\n\nYou can also compare against another branch by doing <b>git diff &lt;branch_name&gt;</b>.\n\nThis is especially useful when you want to double-check your work before saving it."
    },
    {
        title: "Commit 5B: git log",
        text: "There are times where someone might’ve deleted a feature that you wanted to keep a few commits ago, but you don’t know which one.\n\nTo find it, type <b>git log</b>.\n\nThis command shows the full commit history of your branch, including who made each commit, when they made it, and the commit message.\n\nIf your team writes good commit messages, this makes tracking changes much easier!"
    },
    {
        title: "Commit 5C: git log --oneline",
        text: "Commit histories can get very long and overwhelming.\n\nTo make it easier to read, you can condense each commit into a single line by typing <b>git log --oneline</b>.\n\nThis gives you a quick overview of your project’s history without too much detail.\n\nUse this when you just need a fast summary."
    },
    {
        title: "Commit 5D: git blame",
        text: "Another way to detect bugs is <b>git blame</b>.\n\nThis command tells you who last modified each line of a specific file.\n\nIt also shows which commit introduced that change.\n\nThis can help you understand why certain code was written and track down bugs more easily."
    },
    {
        title: "Commit 5E: Tips & Conclusion",
        text: "As of now, you’ve learned how to view your repository’s commit history.\n\nYou should take advantage of these commands when reviewing your own code and your teammates’ contributions.\n\nThey can help you resolve bugs and understand how your project evolved over time.\n\nHere’s a summary of commands you learned in this lesson:\n- git diff\n- git log\n- git log --oneline\n- git blame\n\nCongratulations! You’ve finished the first five lessons.\n\nIf you’re still confused about Git commands, don’t worry—the best way to learn is by using them in real projects.\n\nPress <b>FINISH</b> whenever you’re ready!"
    }
]

export default function Lesson5() {
    const navigate = useNavigate()
    const [pageIndex, setPageIndex] = useState(0)

    const handleNext = () => {
        if (pageIndex < pages.length - 1) {
            setPageIndex(pageIndex + 1)
        } else {
            confetti({
                particleCount: 150,
                spread: 70,
                colors: ['#ffcdb2', '#B5828C', '#E5989B'],
                zIndex: 999
            });
            setTimeout(() => navigate('/lessons'), 3000);
        }
    }

    const handleBack = () => {
        if (pageIndex > 0) setPageIndex(pageIndex - 1);
    };

    useEffect(() => {
        const scrollContainer = document.querySelector('.l1box-content');
        if (scrollContainer) scrollContainer.scrollTo(0, 0);
    }, [pageIndex]);

    return (
        <div className="l1-terminal-page">
            <div className="logo-wrapper">
                <img src={logoIcon} alt="logo" className="logo-icon" />
                <span className="logo">git-it!</span>
            </div>
            <div className="container">
                <div className="l1box-container">
                    <div className="l1box-header">
                        <div className="red-dot-btn">
                            <button className="red-dot-btn" onClick={() => navigate('/lessons')}></button>
                        </div>
                    </div>
                    <div className="l1box">
                        <div className="l1box-content">
                            <h1 className="l-title">{pages[pageIndex].title}</h1>
                            <p className="l-text" dangerouslySetInnerHTML={{ __html: pages[pageIndex].text.replace(/\n/g, '<br/>') }} />
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
                    <Terminal
                        allowedCommands={['clear', 'cls', 'ls', 'cd', 'cat', 'git', 'touch', 'mkdir', 'rmdir', 'rm', 'mv', 'echo']}
                        allowedGitSubcommands={['log', 'status', 'diff', 'blame']}
                        showBranch={true}
                    />
                </div>
            </div>
        </div>
    )
}
