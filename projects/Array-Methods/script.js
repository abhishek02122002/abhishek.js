
const emojis = [
     '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
     '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🍆', '🥦',
     '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔'
 ];
 

 const originalArrayEl = document.getElementById('original-array');
 const resultArrayEl = document.getElementById('result-array');
 const methodInfoEl = document.getElementById('method-info');
 const codeExampleEl = document.getElementById('code-example');
 const methodButtons = document.querySelectorAll('.method-btn');
 const resetBtn = document.getElementById('reset-btn');
 const shuffleBtn = document.getElementById('shuffle-btn');
 
 // Current array state
 let currentArray = [...emojis];
 let shuffledArray = false;
 
 // Initialize the app
 function init() {
     renderOriginalArray();
     resetResultArray();
     addEventListeners();
 }
 
 // Render original array
 function renderOriginalArray() {
     originalArrayEl.innerHTML = '';
     currentArray.forEach(emoji => {
         const emojiEl = document.createElement('div');
         emojiEl.className = 'emoji-item';
         emojiEl.textContent = emoji;
         originalArrayEl.appendChild(emojiEl);
     });
 }
 
 // Reset result array
 function resetResultArray() {
     resultArrayEl.innerHTML = '';
     methodInfoEl.innerHTML = 'Click any array method button to see the magic!';
     codeExampleEl.innerHTML = '// Result will appear here';
 }
 
 // Add event listeners
 function addEventListeners() {
     methodButtons.forEach(button => {
         button.addEventListener('click', () => {
             const method = button.dataset.method;
             demonstrateMethod(method);
         });
     });
     
     resetBtn.addEventListener('click', resetArrays);
     shuffleBtn.addEventListener('click', shuffleArrays);
 }
 
 // Demonstrate array method
 function demonstrateMethod(method) {
     let result;
     let explanation = '';
     let codeExample = '';
     
     switch(method) {
         case 'filter':
             result = currentArray.filter(emoji => emoji.includes('🍎') || emoji.includes('🍓'));
             explanation = 'The <span class="highlight">filter()</span> method creates a new array with all elements that pass the test (berries in this case).';
             codeExample = `const berries = fruits.filter(fruit => \n  fruit === '🍎' || fruit === '🍓');`;
             break;
             
         case 'map':
             result = currentArray.map(emoji => emoji + '✨');
             explanation = 'The <span class="highlight">map()</span> method creates a new array by calling a function on every element (adding sparkles here).';
             codeExample = `const sparkledFruits = fruits.map(fruit => fruit + '✨');`;
             break;
             
         case 'reduce':
             const counts = currentArray.reduce((acc, emoji) => {
                 acc[emoji] = (acc[emoji] || 0) + 1;
                 return acc;
             }, {});
             
             result = Object.entries(counts).map(([emoji, count]) => `${emoji}×${count}`);
             explanation = 'The <span class="highlight">reduce()</span> method reduces the array to a single value (counting each fruit/veggie here).';
             codeExample = `const counts = fruits.reduce((acc, fruit) => {\n  acc[fruit] = (acc[fruit] || 0) + 1;\n  return acc;\n}, {});`;
             break;
             
         case 'sort':
             result = [...currentArray].sort();
             explanation = 'The <span class="highlight">sort()</span> method sorts the elements (alphabetically by emoji here).';
             codeExample = `const sortedFruits = [...fruits].sort();`;
             break;
             
         case 'find':
             result = [currentArray.find(emoji => emoji.includes('🥑')) || 'Not found'];
             explanation = 'The <span class="highlight">find()</span> method returns the first element that satisfies the condition (finding avocado here).';
             codeExample = `const avocado = fruits.find(fruit => fruit === '🥑');`;
             break;
             
         case 'some':
             const hasBerry = currentArray.some(emoji => emoji.includes('🍓'));
             result = [hasBerry ? 'Contains berries! 🍓' : 'No berries found 😢'];
             explanation = 'The <span class="highlight">some()</span> method tests whether at least one element passes the condition (checking for berries).';
             codeExample = `const hasBerry = fruits.some(fruit => fruit === '🍓');`;
             break;
             
         case 'every':
             const allFruits = currentArray.every(emoji => !['🥦', '🥕', '🧅'].includes(emoji));
             result = [allFruits ? 'All are fruits!' : 'Contains veggies too!'];
             explanation = 'The <span class="highlight">every()</span> method tests if all elements pass the condition (checking if all are fruits).';
             codeExample = `const allFruits = fruits.every(fruit => \n  !['🥦','🥕','🧅'].includes(fruit));`;
             break;
             
         case 'slice':
             result = currentArray.slice(5, 10);
             explanation = 'The <span class="highlight">slice()</span> method returns a portion of the array (items 5-10 here).';
             codeExample = `const someFruits = fruits.slice(5, 10);`;
             break;
             
         case 'splice':
             result = [...currentArray];
             result.splice(3, 2, '🍍', '🥝');
             explanation = 'The <span class="highlight">splice()</span> method changes the array by removing/replacing elements (replacing items 3-4 with pineapple and kiwi).';
             codeExample = `fruits.splice(3, 2, '🍍', '🥝');`;
             break;
             
         case 'concat':
             const moreFruits = ['🥭', '🍍', '🥝'];
             result = currentArray.concat(moreFruits);
             explanation = 'The <span class="highlight">concat()</span> method merges two or more arrays (adding mango, pineapple, kiwi).';
             codeExample = `const allFruits = fruits.concat(['🥭', '🍍', '🥝']);`;
             break;
     }
     
     renderResultArray(result);
     methodInfoEl.innerHTML = explanation;
     codeExampleEl.innerHTML = codeExample;
 }
 

 function renderResultArray(result) {
     resultArrayEl.innerHTML = '';
     
     if (!Array.isArray(result)) {
         result = [result];
     }
     
     result.forEach(item => {
         const itemEl = document.createElement('div');
         itemEl.className = 'emoji-item';
         itemEl.textContent = item;
         resultArrayEl.appendChild(itemEl);
     });
 }
 

 function resetArrays() {
     currentArray = [...emojis];
     shuffledArray = false;
     renderOriginalArray();
     resetResultArray();
 }
 

 function shuffleArrays() {
     if (!shuffledArray) {
         currentArray = [...currentArray].sort(() => Math.random() - 0.5);
         shuffledArray = true;
     } else {
         currentArray = [...emojis];
         shuffledArray = false;
     }
     renderOriginalArray();
     resetResultArray();
 }
 
 // Initialize the app
 init();