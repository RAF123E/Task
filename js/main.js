
let customers = [];
let transactions = [];

function displayTable(data) {
  let tableBody = document.getElementById('transactions-body');
  tableBody.innerHTML = '';

  data.forEach(transaction => {
    let customer = customers.find(c => c.id === transaction.customer_id);
    let row = `
      <tr>
        <td>${transaction.customer_id}</td>
        <td>${customer ? customer.name : 'Unknown'}</td>
        <td>${transaction.date}</td>
        <td>${transaction.amount}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

function applyFilters() {
  let filterName = document.getElementById('filter-name').value.toLowerCase();
  let filterAmount = parseInt(document.getElementById('filter-amount').value);

  let filteredTransactions = transactions.filter(transaction => {
    let customer = customers.find(c => c.id === transaction.customer_id);
    let nameMatch = customer ? customer.name.toLowerCase().includes(filterName) : false;
    let amountMatch = isNaN(filterAmount) || transaction.amount == filterAmount;
    return nameMatch && amountMatch;
  });

  displayTable(filteredTransactions);
  updateChart(filteredTransactions);
}

const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Transaction Amount',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }]
  },
  options: {}
});

function updateChart(data) {
  const dates = data.map(transaction => transaction.date);
  const amounts = data.map(transaction => transaction.amount);

  chart.data.labels = dates;
  chart.data.datasets[0].data = amounts;
  chart.update();
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/customers')
    .then(response => response.json())
    .then(data => {
      customers = data;
      return fetch('http://localhost:3000/transactions');
    })
    .then(response => response.json())
    .then(data => {
      transactions = data;
      displayTable(transactions);
      updateChart(transactions);
      document.querySelector('button').addEventListener('click', applyFilters);
    })
    .catch(error => console.error('Error:', error));
});
