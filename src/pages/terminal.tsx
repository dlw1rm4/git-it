import { useState, useEffect, useRef } from 'react'

type FSFile = {
    type: 'file';
    content: string;
};

type FSFolder = {
    type: 'folder';
    children: Record<string, FSFile | FSFolder>;
};

type CommitEntry = {
    hash: string;
    author: string;
    date: string;
    message: string;
};

type TerminalProps = {
    allowedCommands: string[];
    allowedGitSubcommands?: string[];
    showBranch?: boolean;
    onStateChange?: (staged: string[], modified: string[]) => void;
}

const MAX_LINES = 100;

const defaultFs: FSFolder = {
    type: 'folder',
    children: {
        'README.md': { type: 'file', content: 'Welcome to the git-it tutorial!' },
        'src': { type: 'folder', children: { 'app.js': { type: 'file', content: 'console.log("Hello Git!");' } } },
        'images': { type: 'folder', children: { 'logo.png': { type: 'file', content: '[Binary Data]' } } }
    }
};

// Simulated commit history shared across the session
const initialCommits: CommitEntry[] = [
    { hash: 'a1b2c3d', author: 'Alice <alice@example.com>', date: 'Mon May 12 10:00:00 2025', message: 'initial commit' },
    { hash: 'e4f5a6b', author: 'Bob <bob@example.com>',   date: 'Tue May 13 14:22:00 2025', message: 'add README' },
    { hash: 'c7d8e9f', author: 'Alice <alice@example.com>', date: 'Wed May 14 09:15:00 2025', message: 'debugged button' },
];

function resolvePath(fs: FSFolder, currentPath: string[], target: string): { dir: FSFolder, filename: string } | null {
    const parts = target.split('/');
    const filename = parts[parts.length - 1];
    const dirParts = parts.slice(0, -1);

    let path = [...currentPath];
    for (const part of dirParts) {
        if (part === '..') {
            if (path.length > 1) path = path.slice(0, -1);
        } else {
            path = [...path, part];
        }
    }

    let dir: FSFolder = fs;
    for (const s of path.slice(1)) {
        const node = dir.children[s];
        if (!node || node.type !== 'folder') return null;
        dir = node as FSFolder;
    }
    return { dir, filename };
}

export default function Terminal({ allowedCommands, allowedGitSubcommands, showBranch = false, onStateChange }: TerminalProps) {
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalLines, setTerminalLines] = useState(['Welcome to git-it terminal!', 'Type a command to begin.']);
    const [currentPath, setCurrentPath] = useState(['root']);
    const [isLoading, setIsLoading] = useState(false);
    const [branches, setBranches] = useState(['main']);
    const [currentBranch, setCurrentBranch] = useState('main');
    const [fs, setFs] = useState<FSFolder>(defaultFs);
    const [stagedFiles, setStagedFiles] = useState<string[]>([]);
    const [modifiedFiles, setModifiedFiles] = useState<string[]>(['lesson3.html']);
    const [commits, setCommits] = useState<CommitEntry[]>(initialCommits);
    const [gitInitialized, setGitInitialized] = useState(false);
    const terminalOutputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [terminalLines]);

    useEffect(() => {
        onStateChange?.(stagedFiles, modifiedFiles);
    }, [stagedFiles, modifiedFiles]);

    const isAllowed = (command: string) => allowedCommands.includes(command);
    const isGitAllowed = (sub: string) => !allowedGitSubcommands || allowedGitSubcommands.includes(sub);

    const randomHash = () => Math.random().toString(16).slice(2, 9);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        if (isLoading) return;

        const input = terminalInput.trim();
        const [command, ...args] = input.split(' ');
        const target = args[0];

        let response = '';
        let newLines = [...terminalLines, `> ${input}`];

        let currentDir: FSFolder = fs;
        for (const segment of currentPath.slice(1)) {
            currentDir = currentDir.children[segment] as FSFolder;
        }

        // check if command is allowed
        if (command !== '' && !isAllowed(command)) {
            newLines.push(`command not found: ${command}`);
            if (newLines.length > MAX_LINES) newLines = newLines.slice(-MAX_LINES);
            setTerminalLines(newLines);
            setTerminalInput('');
            return;
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

            case 'cat': {
                const file = currentDir.children?.[target];
                if (file?.type === 'file') {
                    response = file.content;
                } else if (file?.type === 'folder') {
                    response = `cat: ${target}: Is a directory`;
                } else {
                    response = `cat: ${target}: No such file`;
                }
                break;
            }

            case 'touch':
                if (!target) { response = 'touch: missing filename'; break; }
                setFs(prev => {
                    const updated = structuredClone(prev);
                    let dir: FSFolder = updated;
                    for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                    dir.children[target] = { type: 'file', content: '' };
                    return updated;
                });
                setModifiedFiles(prev => prev.includes(target) ? prev : [...prev, target]);
                response = `created file '${target}'`;
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
                    response = `removed '${target}'`;
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
                response = `created directory '${target}'`;
                break;

            case 'rmdir':
                if (!target) { response = 'rmdir: missing name'; break; }
                if (!currentDir.children?.[target]) {
                    response = `rmdir: ${target}: No such directory`;
                } else {
                    const node = currentDir.children[target];
                    if (node.type === 'folder' && Object.keys(node.children).length > 0) {
                        response = `rmdir: ${target}: Directory not empty`;
                    } else {
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let dir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) dir = dir.children[s] as FSFolder;
                            delete dir.children[target];
                            return updated;
                        });
                        response = `removed directory '${target}'`;
                    }
                }
                break;

            case 'mv': {
                const dest = args[1]?.trim();
                if (!target || !dest) { response = 'mv: missing operand'; break; }
                if (target === dest) { response = `mv: '${target}' and '${dest}' are the same`; break; }
                if (!currentDir.children?.[target]) {
                    response = `mv: ${target}: No such file or directory`;
                } else {
                    const resolved = resolvePath(fs, currentPath, dest);
                    if (!resolved) {
                        response = `mv: invalid path: ${dest}`;
                    } else {
                        setFs(prev => {
                            const updated = structuredClone(prev);
                            let srcDir: FSFolder = updated;
                            for (const s of currentPath.slice(1)) srcDir = srcDir.children[s] as FSFolder;

                            const moving = srcDir.children[target];
                            const resolvedDest = resolvePath(updated, currentPath, dest);
                            if (!resolvedDest) return updated;

                            if (resolvedDest.dir.children[resolvedDest.filename]?.type === 'folder') {
                                // dest is an existing folder — move INTO it
                                (resolvedDest.dir.children[resolvedDest.filename] as FSFolder).children[target] = moving;
                            } else {
                                // rename or move to new name
                                resolvedDest.dir.children[resolvedDest.filename] = moving;
                            }
                            delete srcDir.children[target];
                            return updated;
                        });
                        response = `moved '${target}' to '${dest}'`;
                    }
                }
                break;
            }

            case 'echo': {
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
                    setModifiedFiles(prev => prev.includes(filename) ? prev : [...prev, filename]);
                    response = `wrote to '${filename}'`;
                } else {
                    response = fullArgs.replace(/^"|"$/g, '');
                }
                break;
            }

            case 'git': {
                const subCommand = args[0];

                if (!subCommand) {
                    response = 'usage: git <command> [<args>]';
                    break;
                }

                if (!isGitAllowed(subCommand)) {
                    response = `git: '${subCommand}' is not available in this lesson.`;
                    break;
                }

                // ── git init ──────────────────────────────────────────────
                if (subCommand === 'init') {
                    setGitInitialized(true);
                    response = 'Initialized empty Git repository in /project/.git/';
                }

                // ── git clone ─────────────────────────────────────────────
                else if (subCommand === 'clone') {
                    const cloneUrl = args[1];
                    if (!cloneUrl) {
                        response = 'usage: git clone <url>';
                    } else if (!cloneUrl.startsWith('https://')) {
                        response = `fatal: repository '${cloneUrl}' does not exist`;
                    } else {
                        const repoName = cloneUrl.split('/').pop()?.replace('.git', '') || 'repo';
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
                }

                // ── git status ────────────────────────────────────────────
                else if (subCommand === 'status') {
                    const lines = [`On branch ${currentBranch}`];
                    if (stagedFiles.length > 0) {
                        lines.push('Changes to be committed:');
                        stagedFiles.forEach(f => lines.push(`  \x1b[32m staged:   ${f}\x1b[0m`));
                    }
                    const unstaged = modifiedFiles.filter(f => !stagedFiles.includes(f));
                    if (unstaged.length > 0) {
                        lines.push('Changes not staged for commit:');
                        unstaged.forEach(f => lines.push(`  modified: ${f}`));
                    }
                    if (stagedFiles.length === 0 && unstaged.length === 0) {
                        lines.push('nothing to commit, working tree clean');
                    }
                    response = lines.join('\n');
                }

                // ── git add ───────────────────────────────────────────────
                else if (subCommand === 'add') {
                    const addTarget = args[1];
                    if (!addTarget) {
                        response = 'usage: git add <file> | git add .';
                    } else if (addTarget === '.') {
                        setStagedFiles(prev => {
                            const all = [...new Set([...prev, ...modifiedFiles])];
                            return all;
                        });
                        response = modifiedFiles.length > 0
                            ? `staged: ${modifiedFiles.join(', ')}`
                            : 'nothing to add';
                    } else if (modifiedFiles.includes(addTarget)) {
                        setStagedFiles(prev => prev.includes(addTarget) ? prev : [...prev, addTarget]);
                        response = `staged: ${addTarget}`;
                    } else {
                        response = `error: pathspec '${addTarget}' did not match any files`;
                    }
                }

                // ── git commit ────────────────────────────────────────────
                else if (subCommand === 'commit') {
                    const mFlag = args[1];
                    const message = args.slice(2).join(' ').replace(/^"|"$/g, '');
                    if (mFlag !== '-m' || !message) {
                        response = 'usage: git commit -m "your message"';
                    } else if (stagedFiles.length === 0) {
                        response = 'nothing to commit, working tree clean';
                    } else {
                        const hash = randomHash();
                        const newCommit: CommitEntry = {
                            hash,
                            author: 'You <you@example.com>',
                            date: new Date().toString(),
                            message,
                        };
                        setCommits(prev => [...prev, newCommit]);
                        setModifiedFiles(prev => prev.filter(f => !stagedFiles.includes(f)));
                        setStagedFiles([]);
                        response = `[${currentBranch} ${hash}] ${message}\n${stagedFiles.length} file(s) changed`;
                    }
                }

                // ── git push ──────────────────────────────────────────────
                else if (subCommand === 'push') {
                    if (commits.length === 0) {
                        response = 'error: nothing to push';
                    } else {
                        newLines.push(`Pushing to origin/${currentBranch}...`);
                        setTerminalLines(newLines);
                        setTerminalInput('');
                        setIsLoading(true);
                        setTimeout(() => {
                            setTerminalLines(prev => [...prev, `Branch '${currentBranch}' pushed to origin.`]);
                            setIsLoading(false);
                        }, 1500);
                        return;
                    }
                }

                // ── git checkout -- <file> (discard changes) ──────────────
                else if (subCommand === 'checkout') {
                    const flag = args[1];
                    if (flag === '--') {
                        const fileName = args[2];
                        if (!fileName) {
                            response = 'usage: git checkout -- <file>';
                        } else if (!modifiedFiles.includes(fileName)) {
                            response = `error: pathspec '${fileName}' did not match any file(s)`;
                        } else {
                            setModifiedFiles(prev => prev.filter(f => f !== fileName));
                            setStagedFiles(prev => prev.filter(f => f !== fileName));
                            response = `Discarded changes to '${fileName}'`;
                        }
                    } else if (flag === '-b') {
                        const newBranch = args[2];
                        if (!newBranch) {
                            response = `error: switch 'b' requires a value`;
                        } else if (branches.includes(newBranch)) {
                            response = `fatal: A branch named '${newBranch}' already exists.`;
                        } else {
                            setBranches(prev => [...prev, newBranch]);
                            setCurrentBranch(newBranch);
                            response = `Switched to a new branch '${newBranch}'`;
                        }
                    } else if (flag && branches.includes(flag)) {
                        setCurrentBranch(flag);
                        response = `Switched to branch '${flag}'`;
                    } else if (flag) {
                        response = `error: pathspec '${flag}' did not match any file(s) known to git`;
                    } else {
                        response = 'usage: git checkout <branch> | git checkout -b <branch> | git checkout -- <file>';
                    }
                }

                // ── git restore --staged <file> ───────────────────────────
                else if (subCommand === 'restore') {
                    const flag = args[1];
                    const fileName = args[2];
                    if (flag === '--staged') {
                        if (!fileName) {
                            response = 'usage: git restore --staged <file>';
                        } else if (!stagedFiles.includes(fileName)) {
                            response = `error: '${fileName}' is not staged`;
                        } else {
                            setStagedFiles(prev => prev.filter(f => f !== fileName));
                            response = `Unstaged '${fileName}'`;
                        }
                    } else {
                        response = 'usage: git restore --staged <file>';
                    }
                }

                // ── git reset --soft HEAD~1 ───────────────────────────────
                else if (subCommand === 'reset') {
                    const flag = args[1];
                    const target = args[2];
                    if (flag === '--soft' && target === 'HEAD~1') {
                        if (commits.length === 0) {
                            response = 'error: no commits to reset';
                        } else {
                            const last = commits[commits.length - 1];
                            setCommits(prev => prev.slice(0, -1));
                            setStagedFiles(prev => [...new Set([...prev, last.message])]);
                            response = `Uncommitted last commit. Changes moved back to staging area.`;
                        }
                    } else {
                        response = 'usage: git reset --soft HEAD~1';
                    }
                }

                // ── git revert HEAD ───────────────────────────────────────
                else if (subCommand === 'revert') {
                    const revTarget = args[1];
                    if (revTarget === 'HEAD') {
                        if (commits.length === 0) {
                            response = 'error: no commits to revert';
                        } else {
                            const last = commits[commits.length - 1];
                            const hash = randomHash();
                            const revertCommit: CommitEntry = {
                                hash,
                                author: 'You <you@example.com>',
                                date: new Date().toString(),
                                message: `Revert "${last.message}"`,
                            };
                            setCommits(prev => [...prev, revertCommit]);
                            response = `[${currentBranch} ${hash}] Revert "${last.message}"\n1 file changed`;
                        }
                    } else {
                        response = 'usage: git revert HEAD';
                    }
                }

                // ── git branch ────────────────────────────────────────────
                else if (subCommand === 'branch') {
                    const flag = args[1];
                    const targetBranch = args[2];

                    if (!flag) {
                        response = branches.map(b => (b === currentBranch ? `* ${b}` : `  ${b}`)).join('\n');
                    } else if (flag === '-d' || flag === '-D') {
                        if (!targetBranch) {
                            response = `error: branch name required`;
                        } else if (targetBranch === 'main') {
                            response = `error: Cannot delete the branch 'main'.`;
                        } else if (targetBranch === currentBranch) {
                            response = `error: Cannot delete the branch '${targetBranch}' which you are currently on.`;
                        } else if (!branches.includes(targetBranch)) {
                            response = `error: branch '${targetBranch}' not found.`;
                        } else {
                            setBranches(prev => prev.filter(b => b !== targetBranch));
                            response = `Deleted branch ${targetBranch}.`;
                        }
                    } else {
                        if (branches.includes(flag)) {
                            response = `fatal: A branch named '${flag}' already exists.`;
                        } else {
                            setBranches(prev => [...prev, flag]);
                            response = `Successfully created branch '${flag}'`;
                        }
                    }
                }

                // ── git diff ──────────────────────────────────────────────
                else if (subCommand === 'diff') {
                    const diffTarget = args[1];
                    if (diffTarget && branches.includes(diffTarget)) {
                        response = `diff against branch '${diffTarget}':\n(simulated) No differences found.`;
                    } else if (modifiedFiles.length === 0) {
                        response = '(no changes detected in working directory)';
                    } else {
                        const lines = modifiedFiles.map(f =>
                            `diff --git a/${f} b/${f}\n--- a/${f}\n+++ b/${f}\n@@ -1 +1 @@\n- old line\n+ new line`
                        );
                        response = lines.join('\n\n');
                    }
                }

                // ── git log ───────────────────────────────────────────────
                else if (subCommand === 'log') {
                    const oneline = args[1] === '--oneline';
                    if (commits.length === 0) {
                        response = 'fatal: your current branch has no commits yet';
                    } else if (oneline) {
                        response = [...commits].reverse().map(c => `${c.hash} ${c.message}`).join('\n');
                    } else {
                        response = [...commits].reverse().map(c =>
                            `commit ${c.hash}\nAuthor: ${c.author}\nDate:   ${c.date}\n\n    ${c.message}`
                        ).join('\n\n');
                    }
                }

                // ── git blame ─────────────────────────────────────────────
                else if (subCommand === 'blame') {
                    const blameFile = args[1];
                    if (!blameFile) {
                        response = 'usage: git blame <file>';
                    } else if (!defaultFs.children[blameFile] && !currentDir.children[blameFile]) {
                        response = `fatal: no such path '${blameFile}' in HEAD`;
                    } else {
                        const last = commits[commits.length - 1];
                        response = `${last.hash} (${last.author.split(' ')[0]} ${last.date.slice(0, 10)}) 1) // last modified in: ${last.message}`;
                    }
                }

                // ── git pull ──────────────────────────────────────────────
                else if (subCommand === 'pull') {
                    const remote = args[1];
                    const pullBranch = args[2] ?? currentBranch;
                    newLines.push(`Pulling from origin/${pullBranch}...`);
                    setTerminalLines(newLines);
                    setTerminalInput('');
                    setIsLoading(true);
                    setTimeout(() => {
                        setTerminalLines(prev => [...prev,
                            remote
                                ? `From origin\n * branch ${pullBranch} -> FETCH_HEAD\nAlready up to date.`
                                : `Already up to date.`
                        ]);
                        setIsLoading(false);
                    }, 1500);
                    return;
                }

                // ── git fetch ─────────────────────────────────────────────
                else if (subCommand === 'fetch') {
                    newLines.push('Fetching from origin...');
                    setTerminalLines(newLines);
                    setTerminalInput('');
                    setIsLoading(true);
                    setTimeout(() => {
                        setTerminalLines(prev => [...prev, 'From origin\n * [new branch] main -> origin/main']);
                        setIsLoading(false);
                    }, 1500);
                    return;
                }

                // ── git merge ─────────────────────────────────────────────
                else if (subCommand === 'merge') {
                    const mergeBranch = args[1];
                    if (!mergeBranch) {
                        response = 'usage: git merge <branch>';
                    } else if (!branches.includes(mergeBranch) && !mergeBranch.startsWith('origin/')) {
                        response = `merge: ${mergeBranch} - not something we can merge`;
                    } else {
                        response = `Merge made by the 'ort' strategy.\n(simulated) Merged '${mergeBranch}' into '${currentBranch}'.`;
                    }
                }

                // ── git rebase ────────────────────────────────────────────
                else if (subCommand === 'rebase') {
                    const rebaseBranch = args[1];
                    if (!rebaseBranch) {
                        response = 'usage: git rebase <branch>';
                    } else if (!branches.includes(rebaseBranch)) {
                        response = `fatal: invalid upstream '${rebaseBranch}'`;
                    } else {
                        response = `Successfully rebased and updated refs/heads/${currentBranch}.`;
                    }
                }

                else {
                    response = `git: '${subCommand}' is not a git command.`;
                }
                break;
            }

            case '':
                break;

            default:
                response = `command not found: ${command}`;
        }

        if (response) newLines.push(response);
        if (newLines.length > MAX_LINES) newLines = newLines.slice(-MAX_LINES);
        setTerminalLines(newLines);
        setTerminalInput('');
    };

    return (
        <div className="terminal">
            <div className="terminal-output" ref={terminalOutputRef}>
                {terminalLines.map((line, index) => (
                    <div key={index} className="terminal-line">{line}</div>
                ))}
            </div>
            <div className="terminal-input-line">
                {!isLoading && (
                    <span className="prompt">
                        {currentPath[currentPath.length - 1]}
                        {showBranch ? ` (${currentBranch})` : ''} &gt;
                    </span>
                )}
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
    );
}