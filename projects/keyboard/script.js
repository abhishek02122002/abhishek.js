document.addEventListener('DOMContentLoaded', function() {
     // DOM Elements
     const notesArea = document.getElementById('notes-area');
     const virtualKeyboard = document.querySelector('.virtual-keyboard');
     const keyboardToggle = document.getElementById('keyboard-toggle');
     const themeToggle = document.getElementById('theme-toggle');
     const helpToggle = document.getElementById('help-toggle');
     const shortcutsModal = document.getElementById('shortcuts-modal');
     const closeModal = document.querySelector('.close-modal');
     const fontSelect = document.getElementById('font-select');
     const colorPicker = document.getElementById('color-picker');
     const toolbarButtons = document.querySelectorAll('.toolbar .btn');
     

     let isCapsLock = false;
     let isShiftPressed = false;
     let isCtrlPressed = false;
     let isAltPressed = false;
     let isKeyboardVisible = false;
     

     checkCapsLock();
     updateKeyboardVisibility();
     

     keyboardToggle.addEventListener('click', toggleKeyboard);
     themeToggle.addEventListener('click', toggleTheme);
     helpToggle.addEventListener('click', showShortcuts);
     closeModal.addEventListener('click', hideShortcuts);
     window.addEventListener('click', (e) => {
         if (e.target === shortcutsModal) hideShortcuts();
     });
     

     document.querySelectorAll('.key').forEach(key => {
         key.addEventListener('mousedown', handleKeyPress);
         key.addEventListener('mouseup', handleKeyRelease);
         key.addEventListener('mouseleave', handleKeyRelease);
     });
     
     // Physical keyboard event listeners
     document.addEventListener('keydown', handlePhysicalKeyDown);
     document.addEventListener('keyup', handlePhysicalKeyUp);
     
     // Formatting tools
     fontSelect.addEventListener('change', () => {
         document.execCommand('fontName', false, fontSelect.value);
         notesArea.focus();
     });
     
     colorPicker.addEventListener('input', () => {
         document.execCommand('foreColor', false, colorPicker.value);
         notesArea.focus();
     });
     
     toolbarButtons.forEach(button => {
         if (button.dataset.command) {
             button.addEventListener('click', () => {
                 document.execCommand(button.dataset.command, false, null);
                 notesArea.focus();
             });
         }
     });
     
     // Functions
     function toggleKeyboard() {
         isKeyboardVisible = !isKeyboardVisible;
         updateKeyboardVisibility();
     }
     
     function updateKeyboardVisibility() {
         if (isKeyboardVisible) {
             virtualKeyboard.style.display = 'flex';
             keyboardToggle.innerHTML = '<i class="fas fa-keyboard"></i> Hide Keyboard';
         } else {
             virtualKeyboard.style.display = 'none';
             keyboardToggle.innerHTML = '<i class="fas fa-keyboard"></i> Show Keyboard';
         }
     }
     
     function toggleTheme() {
         document.body.classList.toggle('night-mode');
         const icon = themeToggle.querySelector('i');
         if (document.body.classList.contains('night-mode')) {
             icon.classList.replace('fa-moon', 'fa-sun');
         } else {
             icon.classList.replace('fa-sun', 'fa-moon');
         }
     }
     
     function showShortcuts() {
         shortcutsModal.style.display = 'flex';
     }
     
     function hideShortcuts() {
         shortcutsModal.style.display = 'none';
     }
     
     function handleKeyPress(e) {
         const key = e.currentTarget;
         const keyValue = key.dataset.key;
         
         key.classList.add('key-active');
         

         switch(keyValue) {
             case 'CapsLock':
                 isCapsLock = !isCapsLock;
                 updateCapsLockState();
                 return;
             case 'Shift':
                 isShiftPressed = true;
                 updateShiftState();
                 return;
             case 'Control':
                 isCtrlPressed = true;
                 return;
             case 'Alt':
                 isAltPressed = true;
                 return;
             case 'Meta':

                 return;
             case 'Backspace':
                 document.execCommand('delete', false, null);
                 notesArea.focus();
                 return;
             case 'Tab':
                 document.execCommand('insertText', false, '\t');
                 notesArea.focus();
                 return;
             case 'Enter':
                 document.execCommand('insertHTML', false, '<br>');
                 notesArea.focus();
                 return;
             case ' ':
                 document.execCommand('insertText', false, ' ');
                 notesArea.focus();
                 return;
         }
         
         // Handle regular keys
         let textToInsert = key.textContent.trim();
         
         if (isShiftPressed || isCapsLock) {
             textToInsert = textToInsert.toUpperCase();
         } else {
             textToInsert = textToInsert.toLowerCase();
         }
         
         document.execCommand('insertText', false, textToInsert);
         notesArea.focus();
     }
     
     function handleKeyRelease(e) {
         const key = e.currentTarget;
         const keyValue = key.dataset.key;
         
         key.classList.remove('key-active');
         
         switch(keyValue) {
             case 'Shift':
                 isShiftPressed = false;
                 updateShiftState();
                 break;
             case 'Control':
                 isCtrlPressed = false;
                 break;
             case 'Alt':
                 isAltPressed = false;
                 break;
         }
     }
     
     function handlePhysicalKeyDown(e) {

         if (e.ctrlKey) {
             switch (e.key.toLowerCase()) {
                 case 'b':
                     e.preventDefault();
                     document.execCommand('bold', false, null);
                     break;
                 case 'i':
                     e.preventDefault();
                     document.execCommand('italic', false, null);
                     break;
                 case 'u':
                     e.preventDefault();
                     document.execCommand('underline', false, null);
                     break;
                 case 'd':
                     e.preventDefault();
                     toggleTheme();
                     break;
                 case 'k':
                     e.preventDefault();
                     toggleKeyboard();
                     break;
                 case 'h':
                     e.preventDefault();
                     showShortcuts();
                     break;
             }
         }
         

         if (e.key === 'Shift') {
             isShiftPressed = true;
             updateShiftState();
         }
         
         if (e.key === 'Control') {
             isCtrlPressed = true;
         }
         
         if (e.key === 'Alt') {
             isAltPressed = true;
         }
         

         if (e.key === 'CapsLock') {
             isCapsLock = !isCapsLock;
             updateCapsLockState();
         }
         

         const virtualKey = document.querySelector(`.key[data-key="${e.key}"]`);
         if (virtualKey) {
             virtualKey.classList.add('key-active');
         }
     }
     
     function handlePhysicalKeyUp(e) {

         if (e.key === 'Shift') {
             isShiftPressed = false;
             updateShiftState();
         }
         
         if (e.key === 'Control') {
             isCtrlPressed = false;
         }
         
         if (e.key === 'Alt') {
             isAltPressed = false;
         }
         
         
         const virtualKey = document.querySelector(`.key[data-key="${e.key}"]`);
         if (virtualKey) {
             virtualKey.classList.remove('key-active');
         }
     }
     
     function updateShiftState() {
         document.querySelectorAll('.key-shift-left, .key-shift-right').forEach(key => {
             if (isShiftPressed) {
                 key.classList.add('key-active');
             } else {
                 key.classList.remove('key-active');
             }
         });
     }
     
     function updateCapsLockState() {
         const capsKey = document.querySelector('.key-caps');
         if (isCapsLock) {
             capsKey.classList.add('key-active');
         } else {
             capsKey.classList.remove('key-active');
         }
     }
     
     function checkCapsLock() {
        
         document.addEventListener('keypress', function(e) {
             const str = String.fromCharCode(e.which);
             if (!e.shiftKey && str === str.toUpperCase() && str !== str.toLowerCase()) {
                 isCapsLock = true;
                 updateCapsLockState();
             } else if (e.shiftKey && str === str.toLowerCase() && str !== str.toUpperCase()) {
                 isCapsLock = true;
                 updateCapsLockState();
             } else {
                 isCapsLock = false;
                 updateCapsLockState();
             }
         });
     }
 });