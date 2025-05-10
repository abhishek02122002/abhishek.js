document.addEventListener('DOMContentLoaded', function() {
     // DOM Elements
     const canvas = document.getElementById('canvas');
     const ctx = canvas.getContext('2d');
     const fileInput = document.getElementById('file-input');
     const openBtn = document.getElementById('open-btn');
     const saveBtn = document.getElementById('save-btn');
     const themeToggle = document.getElementById('theme-toggle');
     const dropMessage = document.getElementById('drop-message');
     const canvasWrapper = document.querySelector('.canvas-wrapper');
     
     // Adjustment controls
     const brightness = document.getElementById('brightness');
     const contrast = document.getElementById('contrast');
     const saturation = document.getElementById('saturation');
     const hue = document.getElementById('hue');
     const blur = document.getElementById('blur');
     const opacity = document.getElementById('opacity');
     
     // Drawing controls
     const brushSize = document.getElementById('brush-size');
     const brushColor = document.getElementById('brush-color');
     const drawBtn = document.getElementById('draw-btn');
     const eraseBtn = document.getElementById('erase-btn');
     
     // Transform controls
     const rotate = document.getElementById('rotate');
     const flipH = document.getElementById('flip-h');
     const flipV = document.getElementById('flip-v');
     const cropBtn = document.getElementById('crop-btn');
     
     // Other controls
     const resetBtn = document.getElementById('reset-btn');
     const undoBtn = document.getElementById('undo-btn');
     const redoBtn = document.getElementById('redo-btn');
     const filterButtons = document.querySelectorAll('.filter-btn');
     
     // State variables
     let isDrawing = false;
     let isErasing = false;
     let isCropping = false;
     let startX, startY;
     let currentImage = null;
     let history = [];
     let historyIndex = -1;
     let flipState = { horizontal: false, vertical: false };
     
     // Initialize canvas
     function initCanvas() {
         canvas.width = 800;
         canvas.height = 600;
         ctx.fillStyle = 'white';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         saveState();
     }
     
     // Theme toggle
     themeToggle.addEventListener('click', function() {
         document.body.classList.toggle('dark-theme');
         const isDark = document.body.classList.contains('dark-theme');
         themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
     });
     
     // Open image
     openBtn.addEventListener('click', function() {
         fileInput.click();
     });
     
     fileInput.addEventListener('change', function(e) {
         if (e.target.files && e.target.files[0]) {
             const reader = new FileReader();
             reader.onload = function(event) {
                 loadImage(event.target.result);
             };
             reader.readAsDataURL(e.target.files[0]);
         }
     });
     
     // Drag and drop
     canvasWrapper.addEventListener('dragover', function(e) {
         e.preventDefault();
         canvasWrapper.classList.add('drag-over');
     });
     
     canvasWrapper.addEventListener('dragleave', function() {
         canvasWrapper.classList.remove('drag-over');
     });
     
     canvasWrapper.addEventListener('drop', function(e) {
         e.preventDefault();
         canvasWrapper.classList.remove('drag-over');
         
         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
             const reader = new FileReader();
             reader.onload = function(event) {
                 loadImage(event.target.result);
             };
             reader.readAsDataURL(e.dataTransfer.files[0]);
         }
     });
     
     // Load image function
     function loadImage(src) {
         const img = new Image();
         img.onload = function() {
             // Calculate dimensions to fit canvas while maintaining aspect ratio
             let width = img.width;
             let height = img.height;
             
             if (width > canvas.width || height > canvas.height) {
                 const ratio = Math.min(canvas.width / width, canvas.height / height);
                 width *= ratio;
                 height *= ratio;
             }
             
             canvas.width = width;
             canvas.height = height;
             
             ctx.clearRect(0, 0, canvas.width, canvas.height);
             ctx.drawImage(img, 0, 0, width, height);
             
             currentImage = img;
             resetAdjustments();
             saveState();
         };
         img.src = src;
     }
     
     // Save image
     saveBtn.addEventListener('click', function() {
         if (canvas.width === 0 || canvas.height === 0) return;
         
         const link = document.createElement('a');
         link.download = 'edited-image.png';
         link.href = canvas.toDataURL('image/png');
         link.click();
     });
     
     // Drawing functionality
     canvas.addEventListener('mousedown', startDrawing);
     canvas.addEventListener('mousemove', draw);
     canvas.addEventListener('mouseup', stopDrawing);
     canvas.addEventListener('mouseout', stopDrawing);
     
     function startDrawing(e) {
         if (isCropping) {
             startX = e.offsetX;
             startY = e.offsetY;
             return;
         }
         
         if (!isDrawing && !isErasing) return;
         
         isDrawing = true;
         ctx.beginPath();
         ctx.moveTo(e.offsetX, e.offsetY);
     }
     
     function draw(e) {
         if (!isDrawing && !isErasing) return;
         
         if (isCropping) {
             // Draw selection rectangle
             redrawCanvas();
             const width = e.offsetX - startX;
             const height = e.offsetY - startY;
             
             ctx.strokeStyle = '#4a6bff';
             ctx.lineWidth = 2;
             ctx.setLineDash([5, 5]);
             ctx.strokeRect(startX, startY, width, height);
             
             ctx.fillStyle = 'rgba(74, 107, 255, 0.2)';
             ctx.fillRect(startX, startY, width, height);
             return;
         }
         
         ctx.lineTo(e.offsetX, e.offsetY);
         ctx.lineWidth = brushSize.value;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
         
         if (isErasing) {
             ctx.globalCompositeOperation = 'destination-out';
             ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
         } else {
             ctx.globalCompositeOperation = 'source-over';
             ctx.strokeStyle = brushColor.value;
         }
         
         ctx.stroke();
     }
     
     function stopDrawing() {
         if (isDrawing || isErasing) {
             isDrawing = false;
             isErasing = false;
             saveState();
         }
         
         if (isCropping) {
             isCropping = false;
             // Implement crop functionality here
             saveState();
         }
     }
     
     // Drawing modes
     drawBtn.addEventListener('click', function() {
         isDrawing = true;
         isErasing = false;
         isCropping = false;
     });
     
     eraseBtn.addEventListener('click', function() {
         isErasing = true;
         isDrawing = false;
         isCropping = false;
     });
     
     cropBtn.addEventListener('click', function() {
         isCropping = true;
         isDrawing = false;
         isErasing = false;
     });
     
     // Adjustments
     brightness.addEventListener('input', applyFilters);
     contrast.addEventListener('input', applyFilters);
     saturation.addEventListener('input', applyFilters);
     hue.addEventListener('input', applyFilters);
     blur.addEventListener('input', applyFilters);
     opacity.addEventListener('input', applyFilters);
     rotate.addEventListener('input', applyFilters);
     
     flipH.addEventListener('click', function() {
         flipState.horizontal = !flipState.horizontal;
         applyFilters();
     });
     
     flipV.addEventListener('click', function() {
         flipState.vertical = !flipState.vertical;
         applyFilters();
     });
     
     // Apply all filters and adjustments
     function applyFilters() {
         if (!currentImage) return;
         
         redrawCanvas();
         
         // Apply CSS filters
         let filter = '';
         
         if (brightness.value !== '0') {
             filter += `brightness(${100 + parseInt(brightness.value)}%) `;
         }
         
         if (contrast.value !== '0') {
             filter += `contrast(${100 + parseInt(contrast.value)}%) `;
         }
         
         if (saturation.value !== '0') {
             filter += `saturate(${100 + parseInt(saturation.value)}%) `;
         }
         
         if (hue.value !== '0') {
             filter += `hue-rotate(${hue.value}deg) `;
         }
         
         if (blur.value !== '0') {
             filter += `blur(${blur.value}px) `;
         }
         
         if (opacity.value !== '100') {
             filter += `opacity(${opacity.value}%) `;
         }
         
         canvas.style.filter = filter.trim();
         
         // Apply transformations
         let transform = '';
         
         if (rotate.value !== '0') {
             transform += `rotate(${rotate.value}deg) `;
         }
         
         if (flipState.horizontal || flipState.vertical) {
             const scaleX = flipState.horizontal ? -1 : 1;
             const scaleY = flipState.vertical ? -1 : 1;
             transform += `scale(${scaleX}, ${scaleY}) `;
         }
         
         canvas.style.transform = transform.trim();
     }
     
     // Reset all adjustments
     function resetAdjustments() {
         brightness.value = 0;
         contrast.value = 0;
         saturation.value = 0;
         hue.value = 0;
         blur.value = 0;
         opacity.value = 100;
         rotate.value = 0;
         flipState = { horizontal: false, vertical: false };
         
         canvas.style.filter = '';
         canvas.style.transform = '';
         
         // Reset filters
         filterButtons.forEach(btn => {
             if (btn.dataset.filter === 'none') {
                 btn.classList.add('active');
             } else {
                 btn.classList.remove('active');
             }
         });
     }
     
     // Filter buttons
     filterButtons.forEach(button => {
         button.addEventListener('click', function() {
             // Remove active class from all buttons
             filterButtons.forEach(btn => btn.classList.remove('active'));
             
             // Add active class to clicked button
             this.classList.add('active');
             
             // Apply selected filter
             const filter = this.dataset.filter;
             applyPresetFilter(filter);
         });
     });
     
     // Apply preset filters
     function applyPresetFilter(filter) {
         switch(filter) {
             case 'none':
                 resetAdjustments();
                 break;
             case 'grayscale':
                 brightness.value = 0;
                 contrast.value = 0;
                 saturation.value = -100;
                 hue.value = 0;
                 blur.value = 0;
                 applyFilters();
                 break;
             case 'sepia':
                 brightness.value = 10;
                 contrast.value = -5;
                 saturation.value = -40;
                 hue.value = 30;
                 blur.value = 0;
                 applyFilters();
                 break;
             case 'invert':
                 canvas.style.filter = 'invert(100%)';
                 break;
             case 'vintage':
                 brightness.value = -10;
                 contrast.value = 5;
                 saturation.value = -20;
                 hue.value = 10;
                 blur.value = 1;
                 applyFilters();
                 break;
             case 'cool':
                 brightness.value = 5;
                 contrast.value = 5;
                 saturation.value = 10;
                 hue.value = 180;
                 blur.value = 0;
                 applyFilters();
                 break;
             case 'warm':
                 brightness.value = 5;
                 contrast.value = 5;
                 saturation.value = 20;
                 hue.value = 30;
                 blur.value = 0;
                 applyFilters();
                 break;
             case 'polaroid':
                 brightness.value = 15;
                 contrast.value = -5;
                 saturation.value = -10;
                 hue.value = 5;
                 blur.value = 0.5;
                 applyFilters();
                 break;
             case 'clarendon':
                 brightness.value = 10;
                 contrast.value = 20;
                 saturation.value = 15;
                 hue.value = 0;
                 blur.value = 0;
                 applyFilters();
                 break;
         }
     }
     
     // Redraw canvas from history
     function redrawCanvas() {
         if (history.length === 0) return;
         
         const imageData = history[historyIndex];
         ctx.putImageData(imageData, 0, 0);
     }
     
     // Save canvas state to history
     function saveState() {
         // If we're not at the end of history, remove future states
         if (historyIndex < history.length - 1) {
             history = history.slice(0, historyIndex + 1);
         }
         
         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
         history.push(imageData);
         historyIndex++;
         
         // Limit history size
         if (history.length > 20) {
             history.shift();
             historyIndex--;
         }
         
         updateUndoRedoButtons();
     }
     
     // Undo functionality
     undoBtn.addEventListener('click', function() {
         if (historyIndex > 0) {
             historyIndex--;
             redrawCanvas();
             updateUndoRedoButtons();
         }
     });
     
     // Redo functionality
     redoBtn.addEventListener('click', function() {
         if (historyIndex < history.length - 1) {
             historyIndex++;
             redrawCanvas();
             updateUndoRedoButtons();
         }
     });
     
     // Update undo/redo buttons state
     function updateUndoRedoButtons() {
         undoBtn.disabled = historyIndex <= 0;
         redoBtn.disabled = historyIndex >= history.length - 1;
     }
     
     // Reset everything
     resetBtn.addEventListener('click', function() {
         if (confirm('Are you sure you want to reset everything?')) {
             initCanvas();
             resetAdjustments();
             history = [];
             historyIndex = -1;
             currentImage = null;
             updateUndoRedoButtons();
         }
     });
     
     // Initialize the app
     initCanvas();
 });