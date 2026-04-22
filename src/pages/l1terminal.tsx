import { useNavigate } from 'react-router-dom'
import './l1terminal.css'
import logoIcon from '../images/logo.png'
import { useState } from 'react'
import confetti from 'canvas-confetti'; 
import { useEffect } from 'react';

export default function Lesson1() {
    const navigate = useNavigate()
    const [pageIndex, setPageIndex] = useState(0)
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState(['Welcome to git-it terminal!', 'Type a command to begin.'])
    const [currentPath, setCurrentPath] = useState(['root']);

    const pages = [
        {
            title: "Commit 1: What is Git?",
            text: "According to the Wikipedia, Git is a distributed version control software system that is capable of managing versions of source code or data. It is often used to control source code by programmers who are developing software collaboratively.\n\nIf you understood that, congrats! You're smarter than me :D !\n\nIf not, don't worry! Say you're playing a video game and reach a difficult dungeon. There's a good chance you might die, so before you enter the dungeon, you save your game. Git is basically a saving point for your project, and GitHub stores everything we do in our Git project online."
        },
        {
            title: "Commit 1A: Create a Repository",
            text: "Let's start with something simple. A repository is a place where we store our project's code and history. We'll try creating a repository locally using the terminal on the right.\n\nTo do this, type 'git init' in the terminal.\n\nOnce you see \"Initialized empty Git repository in /project/.git/\" move onto the next page!"
        },
        {
            title: "Commit 1B: Terminal Commands",
            text: "Now that you know how to make a repository, we should learn some basic terminal commands to navigate and interact with our project.\n\nLet's try clearing the terminal first. Type 'clear' or 'cls' to clear the terminal.\n\nNow, let's have a look at the files in our folder. Type 'ls' to see the files and folders in our current directory.\n\nYou can open any of the folders in our current directory by typing 'cd <folder_name>'. Try it with 'cd images'.\n\nYou can go back to the root director by typing 'cd ..'. Type that and open the src folder next!\n\nTo read the contents of a file, you want to type 'cat <filename>'. Try it by opening the file in the src folder. You will know you're successful when you see 'console.log(\"Hello Git!\");'.\n\nOnce you reach this point, congrats! You're done with your first lesson. Click 'FINISH' to move on!"

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
                    if (args[0] === 'init') {
                        response = 'Initialized empty Git repository in /project/.git/';
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
                            <span className="prompt">{'>'}</span>
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