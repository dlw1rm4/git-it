import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Terminal from './terminal'

const pages = [
    {
        title: "Commit 3: How do I make changes?",
        text: "We learned where we should make our changes, but how do we add them to our repository? Unfortunately, your local environment doesn't autosave the changes you make to the code. Meaning, if you don't push your changes, there's a high chance it'll disappear forever.\n\nFor this lesson, let's pretend that we made changes to the code in the <b>lesson3.html</b> file.\n\nFirst, we need to move our changes from the working directory to the staging area (remember these terms from Lesson 1?). To do this, type: <b>git add &lt;file&gt;</b>. In this case, replace &lt;file&gt; with <b>lesson3.html</b>. This will add all the changes from the inputted file to the staging area.\n\nHowever, if you made changes to a lot of files, this can get very tedious! So, we have a neat command to add every change: <b>git add .</b>\n\nThe '.' signals all files. Try it!"
    },
    {
        title: "Commit 3A: git status",
        text: "After adding your changes to the staging area, we should double-check that you staged the correct changes and files.\n\nIn the terminal, write <b>git status</b>. The red files will tell you what files are unstaged, whereas the green files will tell you what files are staged.\n\nRun it now and confirm <b>lesson3.html</b> is staged."
    },
    {
        title: "Commit 3B: git commit",
        text: "Now that we've put your changes into the staging area, we should move them into your local repository. To do this, type:\n\n<b>git commit -m \"your message here\"</b>\n\nNOTE: The string surrounded by quotations is the commit message you want to put in. It is good practice to have a clear commit message, so that you and your teammates can easily track your code history.\n\nIf you're unsure of what to put in your commit message for this demo, you can write something like <b>\"debugged button\"</b>.\n\nGot it? Let's move onto the final step of making changes to your code's repository!"
    },
    {
        title: "Commit 3C: git push",
        text: "In the previous page, you learned how to commit something to your local repository. Now, let's learn how to share it with your teammates.\n\nThe command for this is simply <b>git push</b>. What this does is take the changes you put in your local repository and push it into the remote repository.\n\nGive it a try!"
    },
    {
        title: "Commit 3D: Undoing Changes",
        text: "So, we learned how to move our changes from the working directory to the staging area to the repository. What happens if we make a mistake along the way?\n\nLet's say you made changes in the working directory that you don't like. You can discard all your changes to the last save by doing <b>git checkout -- &lt;file_name&gt;</b>. Be careful though, this will permanently delete your recent edits to that file!\n\nNow, let's assume you added changes that you didn't like to the staging area. All you need to type is <b>git restore --staged &lt;file_name&gt;</b>.\n\nOkay, but what if you committed it from the staging area? You can type <b>git reset --soft HEAD~1</b> to move it back to the staging area and undo it from there!\n\nBut, what if you already pushed the code? When working with a team, deleting history can cause major headaches. Instead, we use <b>git revert HEAD</b>. This creates a new commit that does the exact opposite of your last one, safely canceling out your mistake without breaking the timeline for your teammates."
    },
    {
        title: "Commit 3E: Tips & Conclusion",
        text: "Before we finish this lesson, here are a few tips:\n\n<b>Commit often, push frugally</b>\nCommitting often creates \"safety checkpoints\" on your own computer. Pushing should happen when a task is actually finished.\n\n<b>git status is your best friend</b>\nRun git status before every single add or commit. It prevents you from accidentally saving files you didn't mean to touch.\n\n<b>Small Commits = Happy Teams</b>\nIt is much easier to undo a small task than to undo an entire day's worth of mixed-up code!\n\nHere's a summary of commands you learned in this lesson:\n- git status\n- git add &lt;file_name&gt;\n- git commit -m \"message\"\n- git push\n- git checkout -- &lt;file_name&gt;\n- git restore --staged &lt;file_name&gt;\n- git reset --soft HEAD~1\n- git revert HEAD\n\nNicely done! Git can get super complicated, but you've made it here. Press 'FINISH' whenever you feel ready to move on."
    }
]

export default function Lesson3() {
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
                        allowedGitSubcommands={['status', 'add', 'commit', 'push', 'checkout', 'restore', 'reset', 'revert']}
                        showBranch={true}
                    />
                </div>
            </div>
        </div>
    )
}