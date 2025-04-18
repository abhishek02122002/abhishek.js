class Calculator {
     constructor(previousOperandTextElement, currentOperandTextElement) {
         this.previousOperandTextElement = previousOperandTextElement;
         this.currentOperandTextElement = currentOperandTextElement;
         this.historyList = document.getElementById('history-list');
         this.clear();
         this.loadHistory();
     }
 
     clear() {
         this.currentOperand = '0';
         this.previousOperand = '';
         this.operation = undefined;
         this.updateDisplay();
     }
 
     delete() {
         this.currentOperand = this.currentOperand.toString().slice(0, -1);
         if (this.currentOperand === '') {
             this.currentOperand = '0';
         }
         this.updateDisplay();
     }
 
     appendNumber(number) {
         if (number === '.' && this.currentOperand.includes('.')) return;
         if (this.currentOperand === '0' && number !== '.') {
             this.currentOperand = number;
         } else {
             this.currentOperand = this.currentOperand.toString() + number.toString();
         }
         this.updateDisplay();
     }
 
     chooseOperation(operation) {
         if (this.currentOperand === '') return;
         if (this.previousOperand !== '') {
             this.compute();
         }
         this.operation = operation;
         this.previousOperand = this.currentOperand;
         this.currentOperand = '';
         this.updateDisplay();
     }
 
     compute() {
         let computation;
         const prev = parseFloat(this.previousOperand);
         const current = parseFloat(this.currentOperand);
         
         if (isNaN(prev)) return;
 
         try {
             switch (this.operation) {
                 case '+':
                     computation = prev + current;
                     break;
                 case '-':
                     computation = prev - current;
                     break;
                 case '*':
                     computation = prev * current;
                     break;
                 case '÷':
                     computation = prev / current;
                     break;
                 case '^':
                     computation = Math.pow(prev, current);
                     break;
                 default:
                     return;
             }
             
             // Add to history
             this.addToHistory(`${this.previousOperand} ${this.operation} ${this.currentOperand} = ${computation}`);
             
             this.currentOperand = computation;
             this.operation = undefined;
             this.previousOperand = '';
             this.updateDisplay();
         } catch (error) {
             this.currentOperand = 'Error';
             this.updateDisplay();
         }
     }
 
     addScientificFunction(func) {
         try {
             let result;
             switch(func) {
                 case 'sin(':
                     result = Math.sin(parseFloat(this.currentOperand));
                     break;
                 case 'cos(':
                     result = Math.cos(parseFloat(this.currentOperand));
                     break;
                 case 'tan(':
                     result = Math.tan(parseFloat(this.currentOperand));
                     break;
                 case '√(':
                     result = Math.sqrt(parseFloat(this.currentOperand));
                     break;
                 case 'log(':
                     result = Math.log10(parseFloat(this.currentOperand));
                     break;
                 case 'ln(':
                     result = Math.log(parseFloat(this.currentOperand));
                     break;
                 case '!':
                     result = this.factorial(parseInt(this.currentOperand));
                     break;
                 case 'π':
                     result = Math.PI;
                     break;
                 case 'e':
                     result = Math.E;
                     break;
                 case '(':
                 case ')':
                     this.currentOperand += func;
                     this.updateDisplay();
                     return;
                 default:
                     return;
             }
             
             // Add to history
             this.addToHistory(`${func}${this.currentOperand}${func.includes('(') ? ')' : ''} = ${result}`);
             
             this.currentOperand = result;
             this.updateDisplay();
         } catch (error) {
             this.currentOperand = 'Error';
             this.updateDisplay();
         }
     }
 
     factorial(n) {
         if (n < 0) return NaN;
         if (n === 0 || n === 1) return 1;
         let result = 1;
         for (let i = 2; i <= n; i++) {
             result *= i;
         }
         return result;
     }
 
     addToHistory(calculation) {
         const historyItem = document.createElement('div');
         historyItem.classList.add('history-item');
         historyItem.textContent = calculation;
         
         // Add click event to reuse calculation result
         historyItem.addEventListener('click', () => {
             const parts = calculation.split(' = ');
             if (parts.length === 2) {
                 this.currentOperand = parts[1];
                 this.updateDisplay();
             }
         });
         
         this.historyList.prepend(historyItem);
         
         // Save to localStorage
         this.saveHistory();
     }
 
     saveHistory() {
         const historyItems = Array.from(this.historyList.children).map(item => item.textContent);
         localStorage.setItem('calculatorHistory', JSON.stringify(historyItems));
     }
 
     loadHistory() {
         const history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
         history.forEach(item => {
             const historyItem = document.createElement('div');
             historyItem.classList.add('history-item');
             historyItem.textContent = item;
             
             historyItem.addEventListener('click', () => {
                 const parts = item.split(' = ');
                 if (parts.length === 2) {
                     this.currentOperand = parts[1];
                     this.updateDisplay();
                 }
             });
             
             this.historyList.appendChild(historyItem);
         });
     }
 
     clearHistory() {
         this.historyList.innerHTML = '';
         localStorage.removeItem('calculatorHistory');
     }
 
     updateDisplay() {
         this.currentOperandTextElement.innerText = this.currentOperand;
         if (this.operation != null) {
             this.previousOperandTextElement.innerText = 
                 `${this.previousOperand} ${this.operation}`;
         } else {
             this.previousOperandTextElement.innerText = '';
         }
     }
 }
 
 // Initialize calculator
 const previousOperandTextElement = document.getElementById('previous-operand');
 const currentOperandTextElement = document.getElementById('current-operand');
 const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
 
 // Number buttons
 document.querySelectorAll('button:not(.scientific):not(.operator):not(.equals):not(#clear):not(#delete):not(#clear-history):not(.tab-btn)').forEach(button => {
     button.addEventListener('click', () => {
         calculator.appendNumber(button.value);
     });
 });
 
 // Operator buttons
 document.querySelectorAll('.operator').forEach(button => {
     button.addEventListener('click', () => {
         calculator.chooseOperation(button.value);
     });
 });
 
 // Scientific function buttons
 document.querySelectorAll('.scientific').forEach(button => {
     button.addEventListener('click', () => {
         calculator.addScientificFunction(button.value);
     });
 });
 
 // Equals button
 document.getElementById('equals').addEventListener('click', () => {
     calculator.compute();
 });
 
 // Clear button
 document.getElementById('clear').addEventListener('click', () => {
     calculator.clear();
 });
 
 // Delete button
 document.getElementById('delete').addEventListener('click', () => {
     calculator.delete();
 });
 
 // Clear history button
 document.getElementById('clear-history').addEventListener('click', () => {
     calculator.clearHistory();
 });
 
 // Theme switcher
 document.getElementById('light-theme').addEventListener('click', () => {
     document.body.classList.add('light-mode');
     document.body.classList.remove('dark-mode');
     localStorage.setItem('calculatorTheme', 'light');
 });
 
 document.getElementById('dark-theme').addEventListener('click', () => {
     document.body.classList.add('dark-mode');
     document.body.classList.remove('light-mode');
     localStorage.setItem('calculatorTheme', 'dark');
 });
 
 // Load saved theme
 const savedTheme = localStorage.getItem('calculatorTheme') || 'dark';
 document.body.classList.add(savedTheme + '-mode');
 
 // Formula tabs functionality
 document.querySelectorAll('.tab-btn').forEach(button => {
     button.addEventListener('click', () => {
         // Remove active class from all buttons and contents
         document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
         document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
         
         // Add active class to clicked button and corresponding content
         button.classList.add('active');
         const tabId = button.getAttribute('data-tab');
         document.getElementById(tabId).classList.add('active');
     });
 });