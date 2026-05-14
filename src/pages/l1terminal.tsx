import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState } from 'react'
import confetti from 'canvas-confetti'; 
import { useEffect } from 'react';

type FSFile = {
    type: 'file';
    content: string;
};

type FSFolder = {
    type: 'folder';
    children: Record<string, FSFile | FSFolder>;
};

export default function Lesson1() {
    const navigate = useNavigate()
    const [pageIndex, setPageIndex] = useState(0)
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState(['Welcome to git-it terminal!', 'Type a command to begin.'])
    const [currentPath, setCurrentPath] = useState(['root']);
    const [isLoading, setIsLoading] = useState(false);

    const pages = [
        {
            title: "Commit 1: What is Git?",
            text: "According to Wikipedia, Git is a distributed version control software system that is capable of managing versions of source code or data. It is often used to control source code by programmers who are developing software collaboratively.\n\nIf you understood that, congrats! You're smarter than me :D !\n\nIf not, don't worry! Maybe this explanation will help you:\n\nSay you're playing a video game and reach a difficult dungeon. There's a good chance you might die, so before you enter the dungeon, you save your game. Git is basically a saving point for your project, and GitHub stores everything we do in our Git project online."
        },
        {
            title: "Commit 1A: Create a Repository",
            text: "Let's start with something simple. A repository is a place where we store our project's code and history. We'll try creating a repository locally using the terminal on the right.\n\nTo do this, type '<b>git init</b>' in the terminal.\n\nOnce you see \"Initialized empty Git repository in /project/.git/\" you’ll know you successfully created a local repository.\n\nBut, what does the word ‘local’ mean? It just means the data only exists on your device! So, the repository you created in the terminal only exists on your end.\n\nLet’s try another way of creating a repository. What if you created a repository on GitHub and want to access it through an IDE like VS Code?\n\nThis is a really simple process. If you go to your repository and find the green button that says ‘Code.’ Click on it, and grab the HTTPS link. Once you copy that link, write ‘<b>git clone &lt;url&gt;</b>’ in the terminal.\n\n<b>NOTE:</b> In this tutorial, anything inside &lt; and &gt; means you replace it with your own value. For example, &lt;url&gt; should be replaced with the actual HTTPS link you copied from GitHub. It'll look something like: https://github.com/username/repo.git\n\nOnce you reach this point, congrats! You’ve successfully created a repository."
        },
        {
            title: "Commit 1B: Repository States",
            text: "Now that you know how to make a repository, you should know the basics of Git repository states.\n\nThere are three main areas:\n- Working directory\n- Staging area\n- Repository\n\nThe working directory is where you actually edit your files.\n\nThe staging area tells us what will be added into your next commit.\n\nThe repository is the permanent history of your code.\n\nFiles can also have different states:\n- Untracked: Git sees it but isn't tracking it yet\n- Staged: added to staging area, ready to commit\n- Committed: safely stored in the repository\n- Modified: tracked file changed since last commit, not yet staged\n- Ignored — explicitly excluded via .gitignore\n\n Don’t worry about how this applies to Git commands yet! We’ll get into it in a future lesson. In the meantime, just keep these in mind."
        },
        {
            title: "Commit 1C: Terminal Commands Pt. 1",
            text: "We should learn some basic terminal commands to navigate and interact with our project.\n\nLet's try clearing the terminal first. Type '<b>clear</b>' or '<b>cls</b>' to clear the terminal.\n\nNow, let's have a look at the files in our folder. Type '<b>ls</b>' to see the files and folders in our current directory.\n\nYou can open any of the folders in our current directory by typing '<b>cd &lt;folder_name&gt;</b>'. Try it with '<b>cd images</b>'.\n\nYou can go back to the root director by typing '<b>cd ..</b>'. Type that and open the src folder next!\n\nTo read the contents of a file, you want to type '<b>cat &lt;filename&gt;</b>'. Try it by opening the file in the src folder. You will know you're successful when you see 'console.log(\"Hello Git!\");'.\n\nLet’s do one more. Try writing ‘<b>touch &lt;file_name&gt;</b>’. This creates an empty file in your current folder.\n\nYou learned five different terminal commands! Now, let’s ramp it up and learn five more in the next page."
        },
        {
            title: "Commit 1D: Terminal Commands Pt. 2",
            text: "In the previous page, we learned to create an empty file. Now, what if we want to remove it? All you need to do is type ‘<b>rm &lt;file_name&gt;</b>’. Now, go check to see if it got removed (you can do this by typing ‘ls’).\n\nWhat if we want to move our file to another location? Simple, type ‘<b>mv &lt;file_name&gt; &lt;address&gt;</b>’. You can also rename your file this way by typing ‘<b>mv &lt;current_file_name&gt; &lt;new_file_name&gt;</b>’.\n\nAnother helpful command is ‘<b>echo &lt;string&gt;</b>’. Try typing ‘echo “Hello world!”’ What do you see? Do you see the terminal “echoing” it back? If so, great! Now, you can add this string to a file by doing ‘echo “string” > <file_name>.’ Oftentimes, the file is a .txt file. Let’s try it by typing ‘echo “hello world” > echofile.txt’. Afterwards, use the cat command on echofile.txt to see the contents!\n\nWe’ve learned to make files. We’ve learned to add stuff in our files. How do we make folders? All you need to do is type ‘<b>mkdir &lt;folder_name&gt;</b>’. Try it!\n\nTo delete a folder, do ‘<b>rmdir &lt;folder_name&gt;</b>’.\n\nCan you try using some of the commands together? Clear your terminal and create a new folder. Add a file in the folder and add contents into it. Check to see if you did it correctly by using the commands you learned in this lesson.\n\nOnce you feel like you got the hang of it, move onto the next page."
        },
        {
            title: "Commit 1E: Conclusion",
            text: "Congratulations! You finished your first lesson. Here’s a summary of what you should have by now:\n- Basic understanding of Git\n- Repository states\n- Creating a repository\n   - git init\n   - git clone\n- 10 terminal commands:\n   - clear\n   - ls   - cd\n   - cat\n   - touch\n   - echo\n   - mv\n   - rm\n   - mkdir\n   - rmdir\n\nOnce you reach this point, congrats! You're done with your first lesson. Click 'FINISH' to move on!"
        }
    ]

    const [fs, setFs] = useState<FSFolder>({
        type: 'folder',
        children: {
            'README.md': { type: 'file', content: 'Welcome to the git-it tutorial!' },
            'src': { type: 'folder', children: { 'app.js': { type: 'file', content: 'console.log("Hello Git!");' } } },
            'images': { type: 'folder', children: { 'logo.png': { type: 'file', content: '[Binary Data]' } } }
        }
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = terminalInput.trim();
            const [command, ...args] = input.split(' ');
            const target = args[0];
            
            let response = '';
            let newLines = [...terminalLines, `> ${input}`];

            let currentDir: FSFolder = fs;
            for (const segment of currentPath.slice(1)) {
                currentDir = currentDir.children[segment] as FSFolder;
            }

            switch (command) {
                case 'clear':
                case 'cls':
                    setTerminalLines([]);
                    setTerminalInput('');
                    return;

                case 'ls':
                    response = Object.keys(currentDir.children).join('    ');
                    break;

                case 'cd':
                    if (!target || target === '.') break;
                    if (target === '..') {
                        if (currentPath.length > 1) setCurrentPath(prev => prev.slice(0, -1));
                    } else if (currentDir.children?.[target]?.type === 'folder') {
                        setCurrentPath(prev => [...prev, target]);
                    } else {
                        response = `cd: no such directory: ${target}`;
                    }
                    break;

                case 'cat':
                    const file = currentDir.children?.[target];
                    if (file?.type === 'file') {
                        response = file.content;
                    } else if (file?.type === 'folder') {
                        response = `cat: ${target}: Is a directory`;
                    } else {
                        response = `cat: ${target}: No such file`;
                    }
                    break;

                case 'touch':
                    if (!target) { response = 'touch: missing filename'; break; }
                    setFs(prev => {
                        const updated = structuredClone(prev);
                        let dir: FSFolder = updated;
                        for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                        dir.children[target] = { type: 'file', content: '' };
                        return updated;
                    });
                    break;

                case 'rm':
                    if (!target) { response = 'rm: missing filename'; break; }
                    if (!currentDir.children?.[target]) {
                        response = `rm: ${target}: No such file`;
                    } else {
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let dir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                            delete dir.children[target];
                            return updated;
                        });
                    }
                    break;

                case 'mkdir':
                    if (!target) { response = 'mkdir: missing name'; break; }
                    setFs(prev => {
                        const updated = structuredClone(prev);
                        let dir: FSFolder = updated;
                        for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                        dir.children[target] = { type: 'folder', children: {} };
                        return updated;
                    });
                    break;

                case 'rmdir':
                    if (!target) { response = 'rmdir: missing name'; break; }
                    if (!currentDir.children?.[target]) {
                        response = `rmdir: ${target}: No such directory`;
                    } else {
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let dir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                            delete dir.children[target];
                            return updated;
                        });
                    }
                    break;

                case 'mv': {
                    const dest = args[1];
                    if (!target || !dest) { response = 'mv: missing operand'; break; }
                    if (!currentDir.children?.[target]) {
                        response = `mv: ${target}: No such file or directory`;
                    } else {
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let dir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                            
                            const moving = dir.children[target];
                            const destNode = dir.children[dest];
                            
                            if (destNode?.type === 'folder') {
                                // move INTO the folder, keep original name
                                destNode.children[target] = moving;
                            } else {
                                // rename
                                dir.children[dest] = moving;
                            }
                            delete dir.children[target];
                            return updated;
                        });
                    }
                    break;
                }
                case 'echo':
                    const fullArgs = args.join(' ');
                    const redirectIndex = fullArgs.indexOf('>');
                    if (redirectIndex !== -1) {
                        const content = fullArgs.slice(0, redirectIndex).trim().replace(/^"|"$/g, '');
                        const filename = fullArgs.slice(redirectIndex + 1).trim();
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let dir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                            dir.children[filename] = { type: 'file', content };
                            return updated;
                        });
                    } else {
                        response = fullArgs.replace(/^"|"$/g, '');
                    }
                    break;

                case 'git':
                    if (args[0] === 'init') {
                        response = 'Initialized empty Git repository in /project/.git/';
                    } else if (args[0] === 'clone') {
                        const cloneUrl = args[1];  // fix: use args[1], not target
                        if (!cloneUrl) {
                            response = 'usage: git clone <url>';
                        } else if (!cloneUrl.startsWith('https://github.com/')) {
                            response = `fatal: repository '${cloneUrl}' does not exist`;
                        } else {
                            const repoName = cloneUrl.split('/').pop()?.replace('.git', '') || 'repo';
                            setFs(prev => {
                                const updated = structuredClone(prev);
                                updated.children[repoName] = {
                                    type: 'folder',
                                    children: {
                                        'README.md': { type: 'file', content: `# ${repoName}` }
                                    }
                                };
                                return updated;
                            });
                            newLines.push(`Cloning into '${repoName}'...`);
                            setTerminalLines(newLines);
                            setTerminalInput('');
                            setIsLoading(true);
                            setTimeout(() => {
                                setTerminalLines(prev => [...prev, 'done.']);
                                setIsLoading(false);
                            }, 2000);
                            return;
                        }
                    } else if (!args[0]) {
                        response = 'usage: git <command> [<args>]';
                    } else {
                        response = `git: '${args[0]}' is not a git command.`;
                    }
                    break;
                case '':
                    break;

                default:
                    response = `command not found: ${command}`;
            }
            
            if (response) newLines.push(response);
            setTerminalLines(newLines);
            setTerminalInput('');
        }
    };

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
                    <div className="terminal">
                        <div className="terminal-output">
                            {terminalLines.map((line, index) => (
                                <div key={index} className="terminal-line">{line}</div>
                            ))}
                        </div>
                        <div className="terminal-input-line">
                            {!isLoading && <span className="prompt">{'>'}</span>}
                            <input
                                type="text"
                                className="terminal-input"
                                value={terminalInput}
                                onChange={(e) => setTerminalInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>
                </div>
                </div>
            </div>
        </div>
    )
}