let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") || 0;

let pieChart, barChart;

// ADD
function addExpense() {
  let title = document.getElementById("title").value;
  let amount = +document.getElementById("amount").value;
  let category = document.getElementById("category").value;

  if (!title || !amount) return;

  expenses.push({
    id: Date.now(),
    title,
    amount,
    category,
    date: new Date().toLocaleDateString()
  });

  save();
}

// DELETE
function del(id) {
  expenses = expenses.filter(e => e.id !== id);
  save();
}

// EDIT
function edit(id) {
  let e = expenses.find(x => x.id === id);
  let t = prompt("Title", e.title);
  let a = prompt("Amount", e.amount);

  e.title = t;
  e.amount = +a;

  save();
}

// BUDGET
function setBudget() {
  budget = +document.getElementById("budgetInput").value;
  localStorage.setItem("budget", budget);
  render();
}

// SAVE
function save() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// RENDER
function render() {
  let list = document.getElementById("list");
  list.innerHTML = "";

  let filter = document.getElementById("filter").value;

  let filtered = filter === "all"
    ? expenses
    : expenses.filter(e => e.category === filter);

  let total = 0;
  let catData = {};

  filtered.forEach(e => {
    total += e.amount;
    catData[e.category] = (catData[e.category] || 0) + e.amount;

    let li = document.createElement("li");
    li.innerHTML = `
      ${e.title} - ₹${e.amount} (${e.category})
      <button onclick="edit(${e.id})">✏️</button>
      <button onclick="del(${e.id})">❌</button>
    `;
    list.appendChild(li);
  });

  document.getElementById("total").innerText = "Total: ₹" + total;

  let rem = budget - total;
  document.getElementById("remaining").innerText = "Remaining: ₹" + rem;

  document.getElementById("budgetText").innerText =
    rem < 0 ? "⚠ Budget Exceeded!" : "✔ On Track";

  updateProgress(total);
  updateCharts(catData);
}

// PROGRESS BAR
function updateProgress(total) {
  let percent = (total / budget) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// CHARTS
function updateCharts(data) {
  let labels = Object.keys(data);
  let values = Object.values(data);

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("pie"), {
    type: "pie",
    data: { labels, datasets: [{ data: values }] }
  });

  barChart = new Chart(document.getElementById("bar"), {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Expenses", data: values }]
    }
  });
}

render();
