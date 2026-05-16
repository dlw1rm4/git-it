import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Terminal from './terminal'

const pages = [
    {
        title: "Commit 4: Syncing Changes",
        text: "Yay! You know how to make changes to your file now. :D Now, let’s learn how to pull our teammates’ changes into our changes.\n\nLet’s say your teammate pushed changes onto a branch you are working on now, but you don’t see it on your computer. The command to update and see their changes is <b>git pull</b>.\n\nWhat this does is fetch the latest changes from the remote repository and merge it to your current local branch. So, if your teammate pushed new code into the branch you’re working on, <b>git pull</b> will download their changes and combine them automatically with yours.\n\nTry it out!"
    },
    {
        title: "Commit 4A: Pulling from a Branch",
        text: "If there are no conflicts, everything merges cleanly. But, if there are conflicts, Git will flag the files that need to be manually resolved before you can continue.\n\nYou can also specify what branch you want to merge from. The command <b>git pull origin &lt;branch_name&gt;</b> will allow you to pull changes from a branch from the remote repository.\n\nFor instance, <b>git pull origin main</b> will pull changes from the main branch."
    },
    {
        title: "Commit 4B: git fetch",
        text: "Okay, so what if you want to download all changes from the remote repository for all the branches and not have it automatically merge with your current branch?\n\nYou would use <b>git fetch</b>. This command just updates your local copy of remote branches so you can see what’s changed.\n\nYou’d then need to manually merge to apply those changes.\n\n<b>git fetch</b> is useful if you want to be safer about what changes you add to your branch. You’re able to review before merging, which is something <b>git pull</b> doesn’t offer!"
    },
    {
        title: "Commit 4C: git merge",
        text: "Let’s say you did <b>git fetch</b> and want to merge the changes into your local branch. You can do this by typing <b>git merge origin/&lt;branch_name&gt;</b>.\n\nThis command also allows you to merge other branches together.\n\nFor example, if you want to merge your branch into the main branch, switch to the main branch, then run <b>git merge &lt;branch_name&gt;</b>.\n\nBe careful! Merge conflicts can happen, so you’ll need to compare the conflicting code and decide what to keep."
    },
    {
        title: "Commit 4D: git rebase",
        text: "What if you don’t want to combine your branches with a merge commit?\n\nYou can move your commits on top of another branch instead by doing <b>git rebase &lt;branch_name&gt;</b>.\n\nThis is useful when your branch is behind and you want a clean, linear history.\n\nHowever, rebasing removes the record of when the branch split happened.\n\n<b>Warning!</b> Never rebase commits that have already been pushed and shared with teammates. Rebasing rewrites history and can cause serious issues for others working on the same branch."
    },
    {
        title: "Commit 4E: Tips & Conclusion",
        text: "Once you understand these commands and their basic concepts, you’re set to sync your branch with other branches.\n\nHere’s a summary of commands you learned in this lesson:\n- git pull\n- git fetch\n- git merge &lt;branch_name&gt;\n- git rebase &lt;branch_name&gt;\n\nIt’s easy to mix up or forget the purposes of each command, so make sure you understand them before using them.\n\nOtherwise, it can cause some serious headaches for your team!\n\nFeel ready to move on? Press <b>FINISH</b> whenever you are."
    }
]

export default function Lesson4() {
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
                        allowedGitSubcommands={['pull', 'fetch', 'merge', 'rebase', 'checkout', 'branch']}
                        showBranch={true}
                    />
                </div>
            </div>
        </div>
    )
}
