import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Terminal from './terminal'

const pages = [
    {
        title: "Commit 1: What is Git?",
        text: "According to Wikipedia, Git is a distributed version control software system that is capable of managing versions of source code or data. It is often used to control source code by programmers who are developing software collaboratively.\n\nIf you understood that, congrats! You're smarter than me :D !\n\nIf not, don't worry! Maybe this explanation will help you:\n\nSay you're playing a video game and reach a difficult dungeon. There's a good chance you might die, so before you enter the dungeon, you save your game. Git is basically a saving point for your project, and GitHub stores everything we do in our Git project online."
    },
    {
        title: "Commit 1A: Create a Repository",
        text: "Let's start with something simple. A repository is a place where we store our project's code and history. We'll try creating a repository locally using the terminal on the right.\n\nTo do this, type '<b>git init</b>' in the terminal.\n\nOnce you see \"Initialized empty Git repository in /project/.git/\" you'll know you successfully created a local repository.\n\nBut, what does the word 'local' mean? It just means the data only exists on your device! So, the repository you created in the terminal only exists on your end.\n\nLet's try another way of creating a repository. What if you created a repository on GitHub and want to access it through an IDE like VS Code?\n\nThis is a really simple process. If you go to your repository and find the green button that says 'Code.' Click on it, and grab the HTTPS link. Once you copy that link, write '<b>git clone &lt;url&gt;</b>' in the terminal.\n\n<b>NOTE:</b> In this tutorial, anything inside &lt; and &gt; means you replace it with your own value. For example, &lt;url&gt; should be replaced with the actual HTTPS link you copied from GitHub. It'll look something like https://github.com/username/repo.git\n\nOnce you reach this point, congrats! You've successfully created a repository."
    },
    {
        title: "Commit 1B: Repository States",
        text: "Now that you know how to make a repository, you should know the basics of Git repository states.\n\nThere are three main areas:\n- Working directory\n- Staging area\n- Repository\n\nThe working directory is where you actually edit your files.\n\nThe staging area tells us what will be added into your next commit.\n\nThe repository is the permanent history of your code.\n\nFiles can also have different states:\n- Untracked: Git sees it but isn't tracking it yet\n- Staged: added to staging area, ready to commit\n- Committed: safely stored in the repository\n- Modified: tracked file changed since last commit, not yet staged\n- Ignored: explicitly excluded via .gitignore\n\nDon't worry about how this applies to Git commands yet! We'll get into it in a future lesson. In the meantime, just keep these in mind."
    },
    {
        title: "Commit 1C: Terminal Commands Pt. 1",
        text: "We should learn some basic terminal commands to navigate and interact with our project.\n\nLet's try clearing the terminal first. Type '<b>clear</b>' or '<b>cls</b>' to clear the terminal.\n\nNow, let's have a look at the files in our folder. Type '<b>ls</b>' to see the files and folders in our current directory.\n\nYou can open any of the folders in our current directory by typing '<b>cd &lt;folder_name&gt;</b>'. Try it with '<b>cd images</b>'.\n\nYou can go back to the root director by typing '<b>cd ..</b>'. Type that and open the src folder next!\n\nTo read the contents of a file, you want to type '<b>cat &lt;filename&gt;</b>'. Try it by opening the file in the src folder. You will know you're successful when you see 'console.log(\"Hello Git!\");'.\n\nLet's do one more. Try writing '<b>touch &lt;file_name&gt;</b>'. This creates an empty file in your current folder.\n\nYou learned five different terminal commands! Now, let's ramp it up and learn five more in the next page."
    },
    {
        title: "Commit 1D: Terminal Commands Pt. 2",
        text: "In the previous page, we learned to create an empty file. Now, what if we want to remove it? All you need to do is type '<b>rm &lt;file_name&gt;</b>'. Now, go check to see if it got removed (you can do this by typing 'ls').\n\nWhat if we want to move our file to another location? Simple, type '<b>mv &lt;file_name&gt; &lt;address&gt;</b>'. You can also rename your file this way by typing '<b>mv &lt;current_file_name&gt; &lt;new_file_name&gt;</b>'.\n\nAnother helpful command is '<b>echo &lt;string&gt;</b>'. Try typing 'echo \"Hello world!\"' What do you see? Do you see the terminal \"echoing\" it back? If so, great! Now, you can add this string to a file by doing 'echo \"string\" > &lt;file_name&gt;'. Oftentimes, the file is a .txt file. Let's try it by typing 'echo \"hello world\" > echofile.txt'. Afterwards, use the cat command on echofile.txt to see the contents!\n\nWe've learned to make files. We've learned to add stuff in our files. How do we make folders? All you need to do is type '<b>mkdir &lt;folder_name&gt;</b>'. Try it!\n\nTo delete a folder, do '<b>rmdir &lt;folder_name&gt;</b>'.\n\nCan you try using some of the commands together? Clear your terminal and create a new folder. Add a file in the folder and add contents into it. Check to see if you did it correctly by using the commands you learned in this lesson.\n\nOnce you feel like you got the hang of it, move onto the next page."
    },
    {
        title: "Commit 1E: Conclusion",
        text: "Congratulations! You finished your first lesson. Here's a summary of what you should have by now:\n- Basic understanding of Git\n- Repository states\n- Creating a repository\n   - git init\n   - git clone\n- 10 terminal commands:\n   - clear\n   - ls\n   - cd\n   - cat\n   - touch\n   - echo\n   - mv\n   - rm\n   - mkdir\n   - rmdir\n\nOnce you reach this point, congrats! You're done with your first lesson. Click 'FINISH' to move on!"
    }
]

export default function Lesson1() {
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
                        allowedGitSubcommands={['init', 'clone']}
                        showBranch={false}
                    />
                </div>
            </div>
        </div>
    )
}