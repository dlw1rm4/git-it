import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Terminal from './terminal'

const pages = [
    {
        title: "Commit 2: What are branches?",
        text: "Branches are super important in Git. They allow you to work on your own copy of the main code so that changes don't conflict and mess up your entire program. When you're making changes to your project's code, it's important that you do so in your own branch, especially when you're in a team. Can you think of why?\n\nThe reason why is this: let's say you're working on a file, and your teammate makes edits to it at the same time. If both you and your teammate try to merge it into the project's main branch, there will almost always be a merge conflict. Merge conflicts can be very annoying to debug, as you have to compare both you and your teammate's files and see what you want to keep.\n\nSo, what is the moral of the story? <b>Always work on your own branch</b> unless you're sure that working on the main branch won't cause issues."
    },
    {
        title: "Commit 2A: Create a Branch",
        text: "It's simple to make your own branch. To make your own branch, type '<b>git branch &lt;branch_name&gt;</b>'. This will create a branch from your current commit.\n\nWhen coming up with a branch name, you should aim for something that concisely describes the purpose well. Bad branch names can make your teammates confused, and that can snowball into a larger issue. It's good practice to stick with lowercase letters and hyphens for your branch names.\n\nEven if you accidentally work on the main branch, you can easily switch over to your newly created branch as long as you haven't committed your code yet.\n\nOnce you've created your own branch, move onto the next page!"
    },
    {
        title: "Commit 2B: Seeing Branches",
        text: "But, how can you tell what branch you're in? All you need to do is type '<b>git branch</b>' in the terminal. The branch that has an asterisk on the left is the one you are currently on.\n\nHowever, just typing 'git branch' will only show you <b>local</b> branches. If you want to see both local and remote (which is what GitHub has) branches, add '-av' to the end. So, this would look like 'git branch -av'.\n\nFor this lesson, we will skip 'git branch -av,' so try it on your own in the future!"
    },
    {
        title: "Commit 2C: Checkout a Branch",
        text: "As you can tell from the previous page, you're likely still on the main branch. We're going to try to 'checkout' your newly created branch by typing '<b>git checkout &lt;branch_name&gt;</b>'.\n\nNow, let's check to see if you did it successfully. Type the command that allows you to see what branch you're on (hint: you learned it in the previous page!). Is the branch you moved to starred now? If so, nicely done!\n\nThere's also a really neat command that allows you to both create and move to a new branch. It really only saves one line, but it's nice if you want to save typing effort. All you have to write is '<b>git checkout -b &lt;branch_name&gt;</b>'. Try creating and moving to a new branch this way.\n\nOnce you have successfully done so, move onto the next page."
    },
    {
        title: "Commit 2D: Delete a Branch",
        text: "We learned how to create and move to a branch, but how do we delete one in case we made a mistake or finished merging our branches with another branch?\n\nThe Git command for this is '<b>git branch -d &lt;branch_name&gt;</b>'. You can also force delete a branch by capitalizing the d ('git branch -D &lt;branch_name&gt;').\n\nThe -d command will warn you of any unmerged branches, whereas -D will not. -D can be especially helpful when you don't like any of the changes you made in that specific branch. But, be warned, deleting branches permanently deletes every edit that only exists on that specific branch.\n\nAdditionally, you cannot delete a branch you're currently on. So, you should move to another branch, like main, when deleting it. Move back to main and try deleting the branch you created.\n\nPlease be extra careful when deleting a branch!"
    },
    {
        title: "Commit 2E: Conclusion",
        text: "In this lesson, you learned the basics of Git branching. This is one of the most important things you can learn when working on a team project, so congratulations!\n\nHere are the commands you learned and practiced with:\n- git branch &lt;branch_name&gt;\n- git branch\n- git checkout &lt;branch_name&gt;\n- git checkout -b &lt;branch_name&gt;\n- git branch -d &lt;branch_name&gt;\n\nIf you feel like you still need practice, feel free to do this lesson all over again! Learning isn't a race, so take your time to understand and ask questions.\n\nOtherwise, press 'FINISH' and move onto the next lesson!"
    }
]

export default function Lesson2() {
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
                        allowedCommands={['clear', 'cls', 'ls', 'cd', 'cat', 'touch', 'rm', 'mkdir', 'rmdir', 'mv', 'echo', 'git']}
                        allowedGitSubcommands={['branch', 'checkout']}
                        showBranch={true}
                    />
                </div>
            </div>
        </div>
    )
}