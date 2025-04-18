
function run() {
     let htmlCode = document.getElementById("html-code");
     let cssCode = document.getElementById("css-code");
     let jsCode = document.getElementById("js-code");
     let output = document.getElementById("output");
     
     output.contentDocument.body.innerHTML = htmlCode.value + "<style>" + cssCode.value + "</style>";
     output.contentWindow.eval(jsCode.value);
     
     // Store code in localStorage
     localStorage.setItem('htmlCode', htmlCode.value);
     localStorage.setItem('cssCode', cssCode.value);
     localStorage.setItem('jsCode', jsCode.value);
 }
 

 document.getElementById("btn-dark").addEventListener("click", function() {
     document.body.classList.remove("light-mode");
     document.body.classList.add("dark-mode");
     localStorage.setItem('theme', 'dark');
 });
 
 document.getElementById("btn-light").addEventListener("click", function() {
     document.body.classList.remove("dark-mode");
     document.body.classList.add("light-mode");
     localStorage.setItem('theme', 'light');
 });
 

 document.getElementById("refresh-btn").addEventListener("click", function() {
     run();
 });
 
 
 document.getElementById("fullscreen-btn").addEventListener("click", function() {
     const iframe = document.getElementById("output");
     if (iframe.requestFullscreen) {
         iframe.requestFullscreen();
     } else if (iframe.webkitRequestFullscreen) {
         iframe.webkitRequestFullscreen();
     } else if (iframe.msRequestFullscreen) {
         iframe.msRequestFullscreen();
     }
 });
 

 window.addEventListener("load", function() {
     const savedTheme = localStorage.getItem('theme') || 'dark';
     document.body.classList.add(savedTheme + '-mode');
     
     document.getElementById("html-code").value = localStorage.getItem('htmlCode') || '';
     document.getElementById("css-code").value = localStorage.getItem('cssCode') || '';
     document.getElementById("js-code").value = localStorage.getItem('jsCode') || '';
     
    
     run();
 });
 

 function setupResizer() {
     const leftPanel = document.querySelector('.left');
     const rightPanel = document.querySelector('.right');
     const resizer = document.createElement('div');
     resizer.className = 'resize-handle';
     
     resizer.addEventListener('mousedown', function(e) {
         e.preventDefault();
         document.addEventListener('mousemove', resize);
         document.addEventListener('mouseup', stopResize);
     });
     
     function resize(e) {
         const containerWidth = document.querySelector('.editor').offsetWidth;
         const newLeftWidth = (e.clientX / containerWidth) * 100;
         
         leftPanel.style.width = `calc(${newLeftWidth}% - 5px)`;
         rightPanel.style.width = `calc(${100 - newLeftWidth}% - 5px)`;
     }
     
     function stopResize() {
         document.removeEventListener('mousemove', resize);
     }
     
     document.querySelector('.editor').appendChild(resizer);
 }
 

 setupResizer();
 
 
 function autoResizeTextareas() {
     const textareas = document.querySelectorAll('textarea');
     textareas.forEach(textarea => {
         textarea.addEventListener('input', function() {
             this.style.height = 'auto';
             this.style.height = (this.scrollHeight) + 'px';
         });
     });
 }
 
 autoResizeTextareas();