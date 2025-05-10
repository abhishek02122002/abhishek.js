document.addEventListener('DOMContentLoaded', function() {
     // DOM Elements
     const themeToggle = document.getElementById('theme-toggle');
     const colorTheme = document.getElementById('color-theme');
     const transactionForm = document.getElementById('transaction-form');
     const transactionName = document.getElementById('transaction-name');
     const transactionAmount = document.getElementById('transaction-amount');
     const transactionType = document.getElementById('transaction-type');
     const transactionCategory = document.getElementById('transaction-category');
     const transactionDate = document.getElementById('transaction-date');
     const transactionList = document.getElementById('transaction-list');
     const totalBalance = document.getElementById('total-balance');
     const totalIncome = document.getElementById('total-income');
     const totalExpense = document.getElementById('total-expense');
     const filterType = document.getElementById('filter-type');
     const filterCategory = document.getElementById('filter-category');
     const filterMonth = document.getElementById('filter-month');
     const toastContainer = document.getElementById('toast-container');
     
     // Categories
     const categories = {
         income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
         expense: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Education', 'Shopping', 'Utilities', 'Other Expenses']
     };
     
     // Initialize
     let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
     let currentTheme = localStorage.getItem('theme') || 'light';
     let currentColorTheme = localStorage.getItem('colorTheme') || 'emerald';
     
     // Set theme
     function setTheme(theme) {
         document.body.setAttribute('data-theme', theme);
         localStorage.setItem('theme', theme);
         themeToggle.checked = theme === 'dark';
     }
     
     // Set color theme
     function setColorTheme(theme) {
         document.body.setAttribute('data-theme-color', theme);
         localStorage.setItem('colorTheme', theme);
         colorTheme.value = theme;
     }
     
     // Toggle theme
     function toggleTheme() {
         currentTheme = currentTheme === 'light' ? 'dark' : 'light';
         setTheme(currentTheme);
     }
     
     // Show toast notification
     function showToast(message, type = 'success') {
         const toast = document.createElement('div');
         toast.classList.add('toast', type);
         toast.innerHTML = `
             <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
             <span>${message}</span>
         `;
         
         toastContainer.appendChild(toast);
         
         // Show toast
         setTimeout(() => {
             toast.classList.add('show');
         }, 100);
         
         // Hide toast after 3 seconds
         setTimeout(() => {
             toast.classList.remove('show');
             setTimeout(() => {
                 toast.remove();
             }, 300);
         }, 3000);
     }
     
     // Populate categories
     function populateCategories() {
         transactionCategory.innerHTML = '<option value="">Select Category</option>';
         const type = transactionType.value;
         
         if (type) {
             categories[type].forEach(category => {
                 const option = document.createElement('option');
                 option.value = category;
                 option.textContent = category;
                 transactionCategory.appendChild(option);
             });
         }
     }
     
     // Populate filter categories
     function populateFilterCategories() {
         filterCategory.innerHTML = '<option value="all">All Categories</option>';
         
         // Get all unique categories from transactions
         const allCategories = [...new Set(transactions.map(t => t.category))];
         
         allCategories.forEach(category => {
             const option = document.createElement('option');
             option.value = category;
             option.textContent = category;
             filterCategory.appendChild(option);
         });
     }
     
     // Populate months filter
     function populateMonths() {
         filterMonth.innerHTML = '<option value="all">All Months</option>';
         
         // Get all unique months from transactions
         const months = [...new Set(transactions.map(t => {
             const date = new Date(t.date);
             return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
         }))].sort();
         
         months.forEach(month => {
             const date = new Date(`${month}-01`);
             const option = document.createElement('option');
             option.value = month;
             option.textContent = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
             filterMonth.appendChild(option);
         });
     }
     
     // Format date
     function formatDate(dateString) {
         const options = { year: 'numeric', month: 'short', day: 'numeric' };
         return new Date(dateString).toLocaleDateString('en-US', options);
     }
     
     // Format currency
     function formatCurrency(amount) {
         return new Intl.NumberFormat('en-US', {
             style: 'currency',
             currency: 'USD'
         }).format(amount);
     }
     
     // Add transaction
     function addTransaction(e) {
         e.preventDefault();
         
         const transaction = {
             id: Date.now(),
             name: transactionName.value.trim(),
             amount: parseFloat(transactionAmount.value),
             type: transactionType.value,
             category: transactionCategory.value,
             date: transactionDate.value
         };
         
         transactions.push(transaction);
         updateLocalStorage();
         updateUI();
         transactionForm.reset();
         
         // Show success toast
         showToast('Transaction added successfully!');
         
         // Add pulse animation to the stat card
         const statCard = document.querySelector(`.stat-card:nth-child(${transaction.type === 'income' ? 2 : 3})`);
         statCard.classList.add('pulse');
         setTimeout(() => {
             statCard.classList.remove('pulse');
         }, 1500);
     }
     
     // Delete transaction
     function deleteTransaction(id) {
         transactions = transactions.filter(transaction => transaction.id !== id);
         updateLocalStorage();
         updateUI();
         
         // Show success toast
         showToast('Transaction deleted successfully!');
     }
     
     // Update local storage
     function updateLocalStorage() {
         localStorage.setItem('transactions', JSON.stringify(transactions));
     }
     
     // Calculate totals
     function calculateTotals() {
         const income = transactions
             .filter(t => t.type === 'income')
             .reduce((sum, t) => sum + t.amount, 0);
             
         const expense = transactions
             .filter(t => t.type === 'expense')
             .reduce((sum, t) => sum + t.amount, 0);
             
         const balance = income - expense;
         
         totalBalance.textContent = formatCurrency(balance);
         totalIncome.textContent = formatCurrency(income);
         totalExpense.textContent = formatCurrency(expense);
     }
     
     // Filter transactions
     function getFilteredTransactions() {
         let filtered = [...transactions];
         
         // Filter by type
         if (filterType.value !== 'all') {
             filtered = filtered.filter(t => t.type === filterType.value);
         }
         
         // Filter by category
         if (filterCategory.value !== 'all') {
             filtered = filtered.filter(t => t.category === filterCategory.value);
         }
         
         // Filter by month
         if (filterMonth.value !== 'all') {
             filtered = filtered.filter(t => {
                 const date = new Date(t.date);
                 const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                 return month === filterMonth.value;
             });
         }
         
         return filtered;
     }
     
     // Display transactions
     function displayTransactions() {
         transactionList.innerHTML = '';
         
         const filteredTransactions = getFilteredTransactions();
         
         if (filteredTransactions.length === 0) {
             transactionList.innerHTML = '<p class="no-transactions">No transactions found</p>';
             return;
         }
         
         filteredTransactions.forEach(transaction => {
             const transactionEl = document.createElement('div');
             transactionEl.classList.add('transaction-item');
             
             transactionEl.innerHTML = `
                 <div class="transaction-info">
                     <div class="transaction-name">${transaction.name}</div>
                     <div class="transaction-category">${transaction.category}</div>
                     <div class="transaction-date">${formatDate(transaction.date)}</div>
                 </div>
                 <div class="transaction-amount ${transaction.type}">
                     ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                 </div>
                 <button class="delete-btn" data-id="${transaction.id}">
                     <i class="fas fa-trash"></i>
                 </button>
             `;
             
             transactionList.appendChild(transactionEl);
         });
     }
     
     // Update charts
     function updateCharts() {
         updateCategoryChart();
         updateMonthlyChart();
     }
     
     // Category chart
     let categoryChart;
     function updateCategoryChart() {
         const ctx = document.getElementById('category-chart').getContext('2d');
         
         // Group by category and type
         const categoryData = {};
         
         transactions.forEach(t => {
             if (!categoryData[t.category]) {
                 categoryData[t.category] = { income: 0, expense: 0 };
             }
             categoryData[t.category][t.type] += t.amount;
         });
         
         const categories = Object.keys(categoryData);
         const incomeData = categories.map(cat => categoryData[cat].income);
         const expenseData = categories.map(cat => categoryData[cat].expense);
         
         if (categoryChart) {
             categoryChart.destroy();
         }
         
         categoryChart = new Chart(ctx, {
             type: 'bar',
             data: {
                 labels: categories,
                 datasets: [
                     {
                         label: 'Income',
                         data: incomeData,
                         backgroundColor: 'rgba(16, 185, 129, 0.7)',
                         borderColor: 'rgba(16, 185, 129, 1)',
                         borderWidth: 1
                     },
                     {
                         label: 'Expense',
                         data: expenseData,
                         backgroundColor: 'rgba(239, 68, 68, 0.7)',
                         borderColor: 'rgba(239, 68, 68, 1)',
                         borderWidth: 1
                     }
                 ]
             },
             options: {
                 responsive: true,
                 plugins: {
                     title: {
                         display: true,
                         text: 'Income vs Expense by Category',
                         color: 'var(--text-color)'
                     },
                     legend: {
                         labels: {
                             color: 'var(--text-color)'
                         }
                     }
                 },
                 scales: {
                     y: {
                         beginAtZero: true,
                         ticks: {
                             color: 'var(--text-color)'
                         },
                         grid: {
                             color: 'rgba(0, 0, 0, 0.1)'
                         }
                     },
                     x: {
                         ticks: {
                             color: 'var(--text-color)'
                         },
                         grid: {
                             color: 'rgba(0, 0, 0, 0.1)'
                         }
                     }
                 }
             }
         });
     }
     
     // Monthly chart
     let monthlyChart;
     function updateMonthlyChart() {
         const ctx = document.getElementById('monthly-chart').getContext('2d');
         
         // Group by month and type
         const monthlyData = {};
         
         transactions.forEach(t => {
             const date = new Date(t.date);
             const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
             
             if (!monthlyData[month]) {
                 monthlyData[month] = { income: 0, expense: 0 };
             }
             monthlyData[month][t.type] += t.amount;
         });
         
         const months = Object.keys(monthlyData).sort();
         const incomeData = months.map(month => monthlyData[month].income);
         const expenseData = months.map(month => monthlyData[month].expense);
         const monthLabels = months.map(month => {
             const [year, m] = month.split('-');
             return new Date(year, m - 1).toLocaleDateString('default', { month: 'short', year: '2-digit' });
         });
         
         if (monthlyChart) {
             monthlyChart.destroy();
         }
         
         monthlyChart = new Chart(ctx, {
             type: 'line',
             data: {
                 labels: monthLabels,
                 datasets: [
                     {
                         label: 'Income',
                         data: incomeData,
                         backgroundColor: 'rgba(16, 185, 129, 0.2)',
                         borderColor: 'rgba(16, 185, 129, 1)',
                         borderWidth: 2,
                         tension: 0.1,
                         fill: true
                     },
                     {
                         label: 'Expense',
                         data: expenseData,
                         backgroundColor: 'rgba(239, 68, 68, 0.2)',
                         borderColor: 'rgba(239, 68, 68, 1)',
                         borderWidth: 2,
                         tension: 0.1,
                         fill: true
                     }
                 ]
             },
             options: {
                 responsive: true,
                 plugins: {
                     title: {
                         display: true,
                         text: 'Monthly Income vs Expense',
                         color: 'var(--text-color)'
                     },
                     legend: {
                         labels: {
                             color: 'var(--text-color)'
                         }
                     }
                 },
                 scales: {
                     y: {
                         beginAtZero: true,
                         ticks: {
                             color: 'var(--text-color)'
                         },
                         grid: {
                             color: 'rgba(0, 0, 0, 0.1)'
                         }
                     },
                     x: {
                         ticks: {
                             color: 'var(--text-color)'
                         },
                         grid: {
                             color: 'rgba(0, 0, 0, 0.1)'
                         }
                     }
                 }
             }
         });
     }
     
     // Update UI
     function updateUI() {
         calculateTotals();
         displayTransactions();
         updateCharts();
         populateFilterCategories();
         populateMonths();
     }
     
     // Event listeners
     themeToggle.addEventListener('change', toggleTheme);
     colorTheme.addEventListener('change', (e) => {
         setColorTheme(e.target.value);
         updateCharts(); // Update charts to reflect new theme colors
     });
     transactionType.addEventListener('change', populateCategories);
     transactionForm.addEventListener('submit', addTransaction);
     transactionList.addEventListener('click', e => {
         if (e.target.closest('.delete-btn')) {
             const id = parseInt(e.target.closest('.delete-btn').dataset.id);
             deleteTransaction(id);
         }
     });
     filterType.addEventListener('change', displayTransactions);
     filterCategory.addEventListener('change', displayTransactions);
     filterMonth.addEventListener('change', displayTransactions);
     
     // Set current date as default
     transactionDate.valueAsDate = new Date();
     
     // Initialize
     setTheme(currentTheme);
     setColorTheme(currentColorTheme);
     populateCategories();
     updateUI();
 });