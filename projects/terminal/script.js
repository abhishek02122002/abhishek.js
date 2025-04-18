document.addEventListener('DOMContentLoaded', () => {
     const terminal = document.getElementById('terminal');
     const output = document.getElementById('output');
     const commandInput = document.getElementById('command-input');
     
     let commandHistory = [];
     let historyIndex = -1;
     let currentTheme = 'dark';
     
     // Fake file system
     const fileSystem = {
         home: {
             type: 'directory',
             contents: {
                 'about.txt': {
                     type: 'file',
                     content: 'This is a web terminal simulator created with HTML, CSS, and JavaScript.'
                 },
                 'projects': {
                     type: 'directory',
                     contents: {
                         'terminal-app': {
                             type: 'file',
                             content: 'A web-based terminal simulator with multiple features.'
                         },
                         'portfolio': {
                             type: 'file',
                             content: 'My personal portfolio website.'
                         }
                     }
                 },
                 'contact.txt': {
                     type: 'file',
                     content: 'Email: user@example.com\nGitHub: github.com/user'
                 }
             }
         }
     };
     
     // System information
     const systemInfo = {
         os: "WebTerminalOS 1.0",
         memory: "8GB",
         processor: "Quantum CPU @ 4.2GHz",
         uptime: "3 days, 5 hours",
         users: 1
     };
 
     // To-do list (persisted in localStorage)
     let todoList = JSON.parse(localStorage.getItem('terminal-todo')) || [];
 
     // Command aliases
     const commandAliases = {
         'dir': 'ls',
         'list': 'ls',
         'show': 'cat',
         'delete': 'rm',
         'remove': 'rm',
         'cls': 'clear',
         'time': 'date',
         '?': 'help'
     };
 
     // ASCII art
     const asciiArt = {
         logo: `
   _    _      _ _        __        __         _     _ 
  | |  | |    | | |       \\ \\      / /        | |   | |
  | |__| | ___| | | ___    \\ \\ /\\ / /__  _ __ | | __| |
  |  __  |/ _ \\ | |/ _ \\    \\ V  V / _ \\| '_ \\| |/ _\` |
  | |  | |  __/ | | (_) |    \\_/\\_/\\___/| | | | | (_| |
  |_|  |_|\\___|_|_|\\___/                |_| |_|_|\\__,_|
         `,
         hacker: `
     (  )   (   )  )
      ) (   )  (  (
      ( )  (    ) )
      _____________
     <_____________> ___
     |             |/ _ \\
     |               | | |
     |               |_| |
  ___|             |\\___/
 /    \\___________/    \\
 \\_____________________/
         `,
         coffee: `
       ) )
      ( (
     ........
     |      |]
     \\      /    
      \`----'
         `
     };
 
     let currentPath = ['home'];
 
     // Initial greeting
     printToTerminal(asciiArt.logo, 'system');
     printToTerminal('Welcome to the Web Terminal! Type "help" to see available commands.', 'system');
 
     // Focus input on any click in terminal
     terminal.addEventListener('click', () => {
         commandInput.focus();
     });
 
     // Handle command input
     commandInput.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') {
             e.preventDefault();
             const command = commandInput.value.trim();
             if (command) {
                 executeCommand(command);
                 commandHistory.push(command);
                 historyIndex = commandHistory.length;
                 commandInput.value = '';
             }
         } else if (e.key === 'ArrowUp') {
             e.preventDefault();
             if (commandHistory.length > 0 && historyIndex > 0) {
                 historyIndex--;
                 commandInput.value = commandHistory[historyIndex];
             }
         } else if (e.key === 'ArrowDown') {
             e.preventDefault();
             if (historyIndex < commandHistory.length - 1) {
                 historyIndex++;
                 commandInput.value = commandHistory[historyIndex];
             } else {
                 historyIndex = commandHistory.length;
                 commandInput.value = '';
             }
         } else if (e.key === 'Tab') {
             e.preventDefault();
             autoCompleteCommand();
         }
     });
 
     function executeCommand(command) {
         printToTerminal(`$ ${command}`, 'input');
         
         // Handle command aliases
         const args = command.split(' ');
         let cmd = args[0].toLowerCase();
         
         if (commandAliases[cmd]) {
             cmd = commandAliases[cmd];
             // Replace the original command with the alias
             args[0] = cmd;
         }
         
         // Easter eggs
         if (command.toLowerCase() === 'sudo make me a sandwich') {
             printToTerminal('Okay. Making you a sandwich... 🥪', 'success');
             return;
         }
         
         if (command.toLowerCase() === 'hello') {
             printToTerminal('Hello there! 👋', 'success');
             return;
         }
         
         if (command.toLowerCase() === 'neofetch') {
             showSystemInfo();
             printToTerminal(asciiArt.logo, 'system');
             return;
         }
         
         switch (cmd) {
             case 'help':
                 showHelp();
                 break;
             case 'clear':
                 clearTerminal();
                 break;
             case 'date':
                 showDate();
                 break;
             case 'about':
                 showAbout();
                 break;
             case 'projects':
                 showProjects();
                 break;
             case 'social':
                 showSocial();
                 break;
             case 'theme':
                 changeTheme(args[1]);
                 break;
             case 'calc':
                 calculate(args.slice(1));
                 break;
             case 'ls':
                 listDirectory();
                 break;
             case 'cd':
                 changeDirectory(args[1]);
                 break;
             case 'cat':
                 showFileContent(args[1]);
                 break;
             case 'echo':
                 printToTerminal(args.slice(1).join(' '), 'system');
                 break;
             case 'mkdir':
                 makeDirectory(args[1]);
                 break;
             case 'touch':
                 createFile(args[1]);
                 break;
             case 'rm':
                 removeItem(args[1]);
                 break;
             case 'sysinfo':
                 showSystemInfo();
                 break;
             case 'todo':
                 manageTodoList(args.slice(1));
                 break;
             case 'art':
                 showAsciiArt(args[1]);
                 break;
             case 'joke':
                 showJoke();
                 break;
             case 'sudo':
                 printToTerminal('Nice try! 😉', 'error');
                 break;
             default:
                 printToTerminal(`Command not found: ${cmd}. Type "help" for available commands.`, 'error');
         }
     }
 
     function printToTerminal(text, type = 'system') {
         const line = document.createElement('div');
         line.className = 'line';
         
         switch (type) {
             case 'input':
                 line.innerHTML = `<span style="color: var(--primary)">${text}</span>`;
                 break;
             case 'error':
                 line.innerHTML = `<span style="color: var(--error)">${text}</span>`;
                 break;
             case 'success':
                 line.innerHTML = `<span style="color: var(--primary)">${text}</span>`;
                 break;
             case 'warning':
                 line.innerHTML = `<span style="color: var(--warning)">${text}</span>`;
                 break;
             default:
                 line.textContent = text;
         }
         
         output.appendChild(line);
         terminal.scrollTop = terminal.scrollHeight;
     }
 
     function showHelp() {
         const helpText = `
 Available commands:
 - help: Show this help message
 - clear: Clear the terminal
 - date: Show current date and time
 - about: Show information about me
 - projects: List my projects
 - social: Show my social links
 - theme [name]: Change terminal theme (dark, light, matrix)
 - calc [expression]: Simple calculator
 - ls: List directory contents
 - cd [dir]: Change directory
 - cat [file]: Show file content
 - echo [text]: Print text to terminal
 - mkdir [name]: Create directory
 - touch [file]: Create file
 - rm [name]: Remove file/directory
 - sysinfo: Show system information
 - todo [add|list|remove]: Manage to-do list
 - art [name]: Show ASCII art (logo, hacker, coffee)
 - joke: Get a random programming joke
 - sudo: Just try it 😉
         `;
         printToTerminal(helpText.trim());
     }
 
     function clearTerminal() {
         output.innerHTML = '';
     }
 
     function showDate() {
         const now = new Date();
         printToTerminal(now.toString());
     }
 
     function showAbout() {
         const aboutText = `
 About Me:
 I'm a developer who loves building interactive web applications.
 This terminal is a simulation of a command line interface built with web technologies.
         `;
         printToTerminal(aboutText.trim());
     }
 
     function showProjects() {
         const projectsText = `
 My Projects:
 1. Web Terminal - A terminal simulator in the browser
 2. Portfolio Website - My personal portfolio
 3. Task Manager - A productivity application
         `;
         printToTerminal(projectsText.trim());
     }
 
     function showSocial() {
         const socialText = `
 Social Links:
 GitHub: https://github.com/abhishek02122002
 Twitter:  https://x.com/Abhishek021217
 LinkedIn: https://www.linkedin.com/in/abhishekkumarsingh17/
         `;
         printToTerminal(socialText.trim());
     }
 
     function changeTheme(themeName) {
         if (!themeName) {
             printToTerminal('Available themes: dark, light, matrix', 'warning');
             return;
         }
         
         const validThemes = ['dark', 'light', 'matrix'];
         if (!validThemes.includes(themeName)) {
             printToTerminal(`Invalid theme: ${themeName}. Available themes: ${validThemes.join(', ')}`, 'error');
             return;
         }
         
         document.body.className = `theme-${themeName}`;
         currentTheme = themeName;
         printToTerminal(`Theme changed to ${themeName}`, 'success');
     }
 
     function calculate(expression) {
         if (expression.length === 0) {
             printToTerminal('Usage: calc [expression]', 'error');
             return;
         }
         
         try {
            
             const result = eval(expression.join(' '));
             printToTerminal(`Result: ${result}`, 'success');
         } catch (e) {
             printToTerminal(`Calculation error: ${e.message}`, 'error');
         }
     }
 
     function listDirectory() {
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
         
         const items = Object.keys(currentDir.contents).map(item => {
             const type = currentDir.contents[item].type === 'directory' ? '📁' : '📄';
             return `${type} ${item}`;
         });
         
         printToTerminal(items.join('\n'));
     }
 
     function changeDirectory(dirName) {
         if (!dirName || dirName === '~') {
             currentPath = ['home'];
             printToTerminal('Changed to home directory', 'success');
             return;
         }
         
         if (dirName === '..') {
             if (currentPath.length > 1) {
                 currentPath.pop();
                 printToTerminal(`Changed to parent directory`, 'success');
             } else {
                 printToTerminal('Already at root directory', 'warning');
             }
             return;
         }
         
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
         
         if (currentDir.contents[dirName] && currentDir.contents[dirName].type === 'directory') {
             currentPath.push(dirName);
             printToTerminal(`Changed to directory: ${dirName}`, 'success');
         } else {
             printToTerminal(`Directory not found: ${dirName}`, 'error');
         }
     }
 
     function showFileContent(fileName) {
         if (!fileName) {
             printToTerminal('Usage: cat [filename]', 'error');
             return;
         }
         
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
         
         if (currentDir.contents[fileName] && currentDir.contents[fileName].type === 'file') {
             printToTerminal(currentDir.contents[fileName].content);
         } else {
             printToTerminal(`File not found: ${fileName}`, 'error');
         }
     }
 
     function makeDirectory(dirName) {
         if (!dirName) {
             printToTerminal('Usage: mkdir [directory name]', 'error');
             return;
         }
 
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
 
         if (currentDir.contents[dirName]) {
             printToTerminal(`Directory already exists: ${dirName}`, 'error');
             return;
         }
 
         currentDir.contents[dirName] = {
             type: 'directory',
             contents: {}
         };
 
         printToTerminal(`Directory created: ${dirName}`, 'success');
     }
 
     function createFile(fileName) {
         if (!fileName) {
             printToTerminal('Usage: touch [file name]', 'error');
             return;
         }
 
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
 
         if (currentDir.contents[fileName]) {
             printToTerminal(`File already exists: ${fileName}`, 'warning');
             return;
         }
 
         currentDir.contents[fileName] = {
             type: 'file',
             content: 'New file created with touch command.'
         };
 
         printToTerminal(`File created: ${fileName}`, 'success');
     }
 
     function removeItem(itemName) {
         if (!itemName) {
             printToTerminal('Usage: rm [file or directory name]', 'error');
             return;
         }
 
         let currentDir = fileSystem;
         for (const dir of currentPath) {
             currentDir = currentDir.contents[dir];
         }
 
         if (!currentDir.contents[itemName]) {
             printToTerminal(`No such file or directory: ${itemName}`, 'error');
             return;
         }
 
         delete currentDir.contents[itemName];
         printToTerminal(`Removed: ${itemName}`, 'success');
     }
 
     function showSystemInfo() {
         const infoText = `
 System Information:
 OS: ${systemInfo.os}
 Memory: ${systemInfo.memory}
 Processor: ${systemInfo.processor}
 Uptime: ${systemInfo.uptime}
 Active users: ${systemInfo.users}
         `;
         printToTerminal(infoText.trim());
     }
 
     function manageTodoList(args) {
         const subCommand = args[0];
         
         switch (subCommand) {
             case 'add':
                 const task = args.slice(1).join(' ');
                 if (!task) {
                     printToTerminal('Usage: todo add [task description]', 'error');
                     return;
                 }
                 todoList.push(task);
                 localStorage.setItem('terminal-todo', JSON.stringify(todoList));
                 printToTerminal(`Added task: "${task}"`, 'success');
                 break;
                 
             case 'list':
                 if (todoList.length === 0) {
                     printToTerminal('Your to-do list is empty.', 'system');
                     return;
                 }
                 printToTerminal('To-Do List:', 'system');
                 todoList.forEach((task, index) => {
                     printToTerminal(`${index + 1}. ${task}`);
                 });
                 break;
                 
             case 'remove':
                 const index = parseInt(args[1]) - 1;
                 if (isNaN(index) || index < 0 || index >= todoList.length) {
                     printToTerminal('Invalid task number. Use "todo list" to see numbers.', 'error');
                     return;
                 }
                 const removed = todoList.splice(index, 1)[0];
                 localStorage.setItem('terminal-todo', JSON.stringify(todoList));
                 printToTerminal(`Removed task: "${removed}"`, 'success');
                 break;
                 
             default:
                 printToTerminal('Usage: todo [add|list|remove]', 'error');
         }
     }
 
     function showAsciiArt(artName) {
         if (!artName) {
             printToTerminal('Available ASCII art: logo, hacker, coffee', 'system');
             return;
         }
         
         if (asciiArt[artName]) {
             printToTerminal(asciiArt[artName], 'system');
         } else {
             printToTerminal(`No ASCII art found for: ${artName}`, 'error');
         }
     }
 
     function showJoke() {
         const jokes = [
             "Why do programmers prefer dark mode? Because light attracts bugs!",
             "Why don't programmers like nature? It has too many bugs.",
             "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
             "Why do Java developers wear glasses? Because they don't C#!",
             "There are only 10 types of people in the world: those who understand binary, and those who don't."
         ];
         const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
         printToTerminal(randomJoke, 'success');
     }
 
     function autoCompleteCommand() {
         const input = commandInput.value.trim();
         if (!input) return;
         
         const args = input.split(' ');
         const currentArg = args[args.length - 1].toLowerCase();
         
         // Command completion
         if (args.length === 1) {
             const commands = [
                 'help', 'clear', 'date', 'about', 'projects', 'social',
                 'theme', 'calc', 'ls', 'cd', 'cat', 'echo', 'joke', 'sudo',
                 'mkdir', 'touch', 'rm', 'sysinfo', 'todo', 'art'
             ];
             
             const matches = commands.filter(cmd => cmd.startsWith(currentArg));
             
             if (matches.length === 1) {
                 commandInput.value = matches[0] + ' ';
             } else if (matches.length > 1) {
                 printToTerminal(`Possible completions: ${matches.join(', ')}`, 'system');
             }
         }
         // File/directory completion for certain commands
         else if (['cd', 'cat', 'rm'].includes(args[0])) {
             let currentDir = fileSystem;
             for (const dir of currentPath) {
                 currentDir = currentDir.contents[dir];
             }
             
             const items = Object.keys(currentDir.contents)
                 .filter(item => item.startsWith(currentArg));
             
             if (items.length === 1) {
                 args[args.length - 1] = items[0];
                 commandInput.value = args.join(' ') + (currentDir.contents[items[0]].type === 'directory' ? '/' : ' ');
             } else if (items.length > 1) {
                 printToTerminal(`Possible completions: ${items.join(', ')}`, 'system');
             }
         }
     }
 });