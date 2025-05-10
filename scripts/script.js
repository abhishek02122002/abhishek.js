// DOM fully loaded hone ka wait karo
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Logic - Light/Dark mode switch
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light'; // LocalStorage se theme get karo
    
    // Page load pe hi theme apply karo (FOUC avoid karne ke liye)
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Agar dark theme hai toh sun icon dikhao
    if (currentTheme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.classList.add('active');
    }
    
    // Theme toggle button pe click handler
    themeToggle.addEventListener('click', function() {
        // Animation add karo
        this.classList.add('animate');
        setTimeout(() => this.classList.remove('animate'), 300);
        
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            // Dark theme activate karo
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            // Light theme activate karo
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        themeToggle.classList.toggle('active');
    });
    
    // Projects data - Yeh array mein humare saare projects store hain
    const projects = [
        {
            id: 'project1',
            title: 'Array Methods',
            description: 'This project demonstrates the use of array methods in JavaScript.',
            date: 'June 2023',
            technologies: ['JavaScript', 'HTML', 'CSS'],
            thumbnail: 'assets/images/array-method.png',
            content: '<iframe src="projects/Array-Methods/index.html" style="width:100%; height:500px; border:none;"></iframe>',
            links: [
            ]
        },
        {
            id: 'project2',
            title: 'Calculator',
            description: 'This project demostrate different methods of Math Object in JavaScript.',
            date: 'July 2023',
            technologies: ['JavaScript', 'HTML', 'CSS3'],
            thumbnail: 'assets/images/calculator.png',
            content: '<iframe src="projects/calculator/index.html" style="width:100%; height:500px; border:none;"></iframe>',
            links: [
            ]
        },
        {
           id: 'project3',
           title: 'Dice Roller',
           description: 'This project demostrate dice Rolling Animation in JavaScript',
           date: 'July 2023',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/dice.png',
           content: '<iframe src="projects/diceRollerAnim/dice.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
             
           ]
       },
       {
           id: 'project4',
           title: 'Game',
           description: 'This project deals with event capturing and bubbling in JavaScript.',
           date: 'June 2023',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/game.png',
           content: '<iframe src="projects/Game/shoot-the-enemy/index.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
               // isme github aur live hosted wala rakhna tha par code bhadda lagega 
           ]
       },

       {
           id: 'project5',
           title: 'IDE',
           description: 'This is an online and interactive IDE for modern HTML, CSS and JAVASCRIPT',
           date: 'September 2023',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/code.png',
           content: '<iframe src="projects/IDE/ide.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
           ]
       },
       {
           id: 'project6',
           title: 'Image Search',
           description: 'This project demostrate use of API and how to fetch them in javascript.',
           date: 'Jan 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/image.png',
           content: '<iframe src="projects/imageSearch/image.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
           ]
       },
       {
           id: 'project7',
           title: 'Terminal',
           description: 'This is a modern terminal build by vanilla javascript',
           date: 'feb 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/terminal.png',
           content: '<iframe src="projects/terminal/index.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
           ]
       },
       {
           id: 'project8',
           title: 'Todo List',
           description: 'This project uses search and filter functionality and it is one of good todo list on internet, build using vanilla javascript.',
           date: 'feb 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/todo.png',
           content: '<iframe src="projects/ToDO-List/todo.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
           ]
       },
       {
           id: 'project9',
           title: 'Tic-tac-toe',
           description: 'This project is a simple game of tic-tac-toe build using vanilla javascript.',
           date: 'Mar 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/tic.png',
           content: '<iframe src="projects/tic-tac-toe/index.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
           ]
       },
       {
           id: 'project10',
           title: 'Weather - App',
           description: 'This project is a simple weather app build using vanilla javascript. It fetches data from API.A part of course by Love babbar',
           date: 'feb 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3'],
           thumbnail: 'assets/images/weather-app.png',
           content: '<iframe src="projects/weather-app/index.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
           ]
       },
       {
           id: 'project11',
           title: 'Clock Project',
           description: 'This project is a simple clock build using vanilla javascript. ',
           date: 'feb 2024',
           technologies: ['JavaScript', 'HTML', 'CSS3','TensorFlow'],
           thumbnail: 'assets/images/clock.png',
           content: '<iframe src="projects/digital-clock/index.html" style="width:100%; height:500px; border:none;"></iframe>',
           links: [
              
           ]
       },
       {
        id: 'project12',
        title: 'Virtual Keyboard',
        description: 'This project is a virtual keyboard designed to get all the keyboard functanility at one place. ',
        date: 'March 2024',
        technologies: ['JavaScript', 'HTML', 'CSS3'],
        thumbnail: 'assets/images/keyboard.png',
        content: '<iframe src="projects/keyboard/index.html" style="width:100%; height:500px; border:none;"></iframe>',
        links: [
           
        ]
    },
    {
        id: 'project13',
        title: 'Image Editor',
        description: 'This project is an image editor and focus mainly on advanced level of editing of an Image. ',
        date: 'December  2024',
        technologies: ['JavaScript', 'HTML', 'CSS3'],
        thumbnail: 'assets/images/imageEditor.png',
        content: '<iframe src="projects/imageEditor/index.html" style="width:100%; height:500px; border:none;"></iframe>',
        links: [
           
        ]
    },
    {
        id: 'project14',
        title: 'Expense Tracker',
        description: 'This is an advanced Expense tracker and uses many advanced features such as charts for displaying expenses.',
        date: 'November 2024',
        technologies: ['JavaScript','Chart.js', 'HTML', 'CSS3'],
        thumbnail: 'assets/images/expenseTracker.png',
        content: '<iframe src="projects/ExpenseTracker/index.html" style="width:100%; height:500px; border:none;"></iframe>',
        links: [
           
        ]
    }
       
    ];
    
    // DOM elements select karo
    const projectsContainer = document.getElementById('projects-container');
    const projectDetailSection = document.getElementById('project-detail');
    const fullscreenBtn = document.createElement('button'); // Fullscreen button banaya
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.className = 'fullscreen-btn';
    
    // Projects ko load karne wala function
    function loadProjects() {
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.title}" class="project-card-img">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="tech">
                        ${project.technologies.map(tech => `<span class = 'skills'>${tech}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Project card pe click karne par detail show karo
            projectCard.addEventListener('click', () => showProjectDetail(project));
            projectsContainer.appendChild(projectCard);
        });
    }
    
    // Project details show karne wala function
    function showProjectDetail(project) {
        // Project details update karo
        document.getElementById('project-title').textContent = project.title;
        document.getElementById('project-date').textContent = project.date;
        document.getElementById('project-tech').textContent = project.technologies.join(' • ');
        document.getElementById('project-description').textContent = project.description;
        
        // Project content display karo
        const projectDisplay = document.getElementById('project-display');
        projectDisplay.innerHTML = project.content;
        
        // Fullscreen button add karo
        projectDisplay.appendChild(fullscreenBtn);
        
        // Links ko handle karo (agar available hain toh)
        const projectLinks = document.querySelector('.project-links');
        projectLinks.innerHTML = '';
        
        if (project.links && project.links.length > 0) {
            project.links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.text;
                if (link.url.startsWith('http')) {
                    linkElement.target = '_blank';
                }
                projectLinks.appendChild(linkElement);
            });
        }
        
        // Hide project grid and show detail section
        projectsContainer.style.display = 'none';
        projectDetailSection.style.display = 'block';
        
        // Developer modal trigger button (agar nahi hai toh create karo)
        if (!document.getElementById('dev-modal-btn')) {
            const devBtn = document.createElement('button');
            devBtn.id = 'dev-modal-btn';
            devBtn.innerHTML = '<i class="fas fa-code"></i>';
            devBtn.className = 'dev-modal-trigger';
            document.body.appendChild(devBtn);
            
            devBtn.addEventListener('click', showDevModal);
        }
    }
    
    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', function() {
        const iframe = document.querySelector('#project-display iframe');
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }
    });
    
    
    document.getElementById('back-button').addEventListener('click', function() {
        projectsContainer.style.display = 'grid';
        projectDetailSection.style.display = 'none';
        
     
        const devBtn = document.getElementById('dev-modal-btn');
        if (devBtn) devBtn.remove();
    });
    
    // Developer modal show karne wala function
    function showDevModal() {
        const modal = document.createElement('div');
        modal.className = 'dev-modal';
        modal.innerHTML = `
            <div class="dev-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Developer Information</h2>
                <div class="dev-info">
                    <p><strong>Name:</strong> Your Name</p>
                    <p><strong>Skills:</strong> JavaScript, HTML, CSS, React</p>
                    <p><strong>Contact:</strong> email@example.com</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-github"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal close karne ka option
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Modal ke bahar click karne pe close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
  
    loadProjects();
    

  
});