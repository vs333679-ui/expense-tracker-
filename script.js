let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") || 0;

let pieChart, barChart;

// ADD
function addExpense(){
  let title=document.getElementById("title").value;
  let amount=+document.getElementById("amount").value;
  let category=document.getElementById("category").value;

  if(!title || !amount) return;

  expenses.push({
    id:Date.now(),
    title,
    amount,
    category,
    date:new Date().getMonth()   // MONTH STORE
  });

  save();
}

// DELETE
function del(id){
  expenses=expenses.filter(e=>e.id!==id);
  save();
}

// EDIT
function edit(id){
  let e=expenses.find(x=>x.id===id);
  document.getElementById("title").value=e.title;
  document.getElementById("amount").value=e.amount;
  document.getElementById("category").value=e.category;

  del(id);
}

// BUDGET
function setBudget(){
  budget=+document.getElementById("budget").value;
  localStorage.setItem("budget",budget);
  render();
}

// SAVE
function save(){
  localStorage.setItem("expenses",JSON.stringify(expenses));
  render();
}

// FILTER
function getFiltered(){
  let month=document.getElementById("monthFilter").value;

  if(month==="all") return expenses;

  return expenses.filter(e=>e.date==month);
}

// RENDER
function render(){
  let list=document.getElementById("list");
  list.innerHTML="";

  let data=getFiltered();

  let total=0;
  let cat={};

  data.forEach(e=>{
    total+=e.amount;
    cat[e.category]=(cat[e.category]||0)+e.amount;

    let li=document.createElement("li");
    li.innerHTML=`
      ${e.title} - ₹${e.amount}
      <div>
        <button onclick="edit(${e.id})">Edit</button>
        <button onclick="del(${e.id})">X</button>
      </div>
    `;
    list.appendChild(li);
  });

  document.getElementById("total").innerText="Total: ₹"+total;

  let rem=budget-total;
  document.getElementById("remaining").innerText="Remaining: ₹"+rem;

  document.getElementById("budgetStatus").innerText =
    rem<0 ? "⚠ Over Budget!" : "✔ On Track";

  updateCharts(cat);
}

// CHARTS
function updateCharts(data){
  let labels=Object.keys(data);
  let values=Object.values(data);

  if(pieChart) pieChart.destroy();
  if(barChart) barChart.destroy();

  pieChart=new Chart(document.getElementById("pie"),{
    type:"pie",
    data:{labels,datasets:[{data:values}]}
  });

  barChart=new Chart(document.getElementById("bar"),{
    type:"bar",
    data:{labels,datasets:[{label:"Expenses",data:values}]}
  });
}

render();
