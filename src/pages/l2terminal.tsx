import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState } from 'react'
import confetti from 'canvas-confetti'; 
import { useEffect } from 'react';

export default function Lesson2() {
    const navigate = useNavigate()
    const [pageIndex, setPageIndex] = useState(0)
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState(['Welcome to git-it terminal!', 'Type a command to begin.'])
    const [currentPath, setCurrentPath] = useState(['root']);
    const [branches, setBranches] = useState(['main']);
    const [currentBranch, setCurrentBranch] = useState('main');

    const pages = [
        {
            title: "Commit 2: What are branches?",
            text: "Branches are super important in Git. They allow you to work on your own copy of the main code so that changes don't conflict and mess up your entire program. When you're making changes to your project's code, it's important that you do so in your own branch, especially when you're in a team. Can you think of why?"
        },
        {
            title: "Commit 2A: Create a Branch",
            text: "To make your own branch, type 'git branch <branch_name>'. This will create a branch of your changes to the code.\n\nYou can also view what branch you're in by typing 'git branch'. The branch that is (left) starred is the branch you are in."
        },
        {
            title: "Commit 2B: Checkout a Branch",
            text: "But, you're not on the branch yet! You need to 'checkout' the branch with 'git checkout <branch_name>'. Once you have successfully done so, congrats! You're on your branch. Press 'FINISH' whenever you are ready."

        }
    ]

    const MOCK_FS = {
            name: 'root',
            type: 'folder',
            children: {
                'README.md': { type: 'file', content: 'Welcome to the git-it tutorial!' },
                'src': {
                type: 'folder',
                children: {
                    'app.js': { type: 'file', content: 'console.log("Hello Git!");' }
                }
                },
                'images': {
                type: 'folder',
                children: {
                    'logo.png': { type: 'file', content: '[Binary Data]' }
                }
                }
            }
        };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = terminalInput.trim();
            const [command, ...args] = input.split(' ');
            const target = args[0];
            
            let response = '';
            let newLines = [...terminalLines, `> ${input}`];

            let currentDir: any = MOCK_FS;
            for (const segment of currentPath.slice(1)) {
                currentDir = currentDir.children[segment];
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
                        if (currentPath.length > 1) {
                            setCurrentPath(prev => prev.slice(0, -1));
                        }
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

                case 'git':
                    const subCommand = args[0];
                    const branchName = args[1];

                    if (subCommand === 'init') {
                        response = 'Initialized empty Git repository in /project/.git/';
                    } 
                    else if (subCommand === 'branch') {
                        if (!branchName) {
                            response = branches.map(b => (b === currentBranch ? `* ${b}` : `  ${b}`)).join('\n');
                        } else {
                            if (branches.includes(branchName)) {
                                response = `fatal: A branch named '${branchName}' already exists.`;
                            } else {
                                setBranches(prev => [...prev, branchName]);
                                response = '';
                            }
                        }
                    } 
                    else if (subCommand === 'checkout') {
                        if (branches.includes(branchName)) {
                            setCurrentBranch(branchName);
                            response = `Switched to branch '${branchName}'`;
                        } else {
                            response = `error: pathspec '${branchName}' did not match any file(s) known to git`;
                        }
                    }
                    else {
                        response = `git: '${subCommand}' is not a git command.`;
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
                        <div className="terminal-output">
                            {terminalLines.map((line, index) => (
                                <div key={index} className="terminal-line">{line}</div>
                            ))}
                        </div>
                        <div className="terminal-input-line">
                            <span className="prompt">{currentPath[currentPath.length - 1]} ({currentBranch}) &gt;</span>
                            <input
                                type="text"
                                className="terminal-input"
                                value={terminalInput}
                                onChange={(e) => setTerminalInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                </div>
                </div>
            </div>
        </div>
    )
}