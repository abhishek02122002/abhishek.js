document.addEventListener('DOMContentLoaded', function() {
     // Theme Toggle
     const themeToggle = document.getElementById('theme-toggle');
     const currentTheme = localStorage.getItem('theme') || 'light';
     
     document.documentElement.setAttribute('data-theme', currentTheme);
     
     if (currentTheme === 'dark') {
         themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
     }
     
     themeToggle.addEventListener('click', function() {
         let theme = document.documentElement.getAttribute('data-theme');
         if (theme === 'light') {
             document.documentElement.setAttribute('data-theme', 'dark');
             localStorage.setItem('theme', 'dark');
             themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
         } else {
             document.documentElement.setAttribute('data-theme', 'light');
             localStorage.setItem('theme', 'light');
             themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
         }
     });
     
     // Projects Data
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
        
     ];
     
     
     const projectsContainer = document.getElementById('projects-container');
     const projectDetailSection = document.getElementById('project-detail');
     
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
                         ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                     </div>
                 </div>
             `;
             
             projectCard.addEventListener('click', () => showProjectDetail(project));
             projectsContainer.appendChild(projectCard);
         });
     }
     
    
     function showProjectDetail(project) {
         document.getElementById('project-title').textContent = project.title;
         document.getElementById('project-date').textContent = project.date;
         document.getElementById('project-tech').textContent = project.technologies.join(' • ');
         document.getElementById('project-description').textContent = project.description;
         
         const projectDisplay = document.getElementById('project-display');
         projectDisplay.innerHTML = project.content;
         
         const projectLinks = document.querySelector('.project-links');
         projectLinks.innerHTML = '';
         
         project.links.forEach(link => {
             const linkElement = document.createElement('a');
             linkElement.href = link.url;
             linkElement.textContent = link.text;
             if (link.url.startsWith('http')) {
                 linkElement.target = '_blank';
             }
             projectLinks.appendChild(linkElement);
         });
         
         projectsContainer.style.display = 'none';
         projectDetailSection.style.display = 'block';
     }
     
   
     document.getElementById('back-button').addEventListener('click', function() {
         projectsContainer.style.display = 'grid';
         projectDetailSection.style.display = 'none';
     });
     
     // Initialize
     loadProjects();
 });