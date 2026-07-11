/* ===========================================
   MoneyPilot Lite
   Dashboard.js
=========================================== */

function calculateDashboard(){

    const selectedMonth =
    document.getElementById("monthFilter").value;

    let income = 0;
    let expense = 0;
    let fixed = 0;
    let variable = 0;

    const filteredTransactions = transactions.filter(t => {

        if(!selectedMonth) return true;

        return t.date.startsWith(selectedMonth);

    });

    filteredTransactions.forEach(t=>{

        const amount = Number(t.amount) || 0;

        if(t.type==="income"){

            income += amount;

        }

        else if(t.type==="expense"){

            expense += amount;

            if(t.fixed){

                fixed += amount;

            }

            else{

                variable += amount;

            }

        }

    });

    const balance = income - expense;

    setValue("balance", balance);

    setValue("incomeValue", income);

    setValue("expenseValue", expense);

    setValue("fixedTotal", fixed);

    setValue("variableTotal", variable);

    setValue("savingTotal", balance);

}

function setValue(id, value) {

    const el = document.getElementById(id);

    if (!el) return;

    el.innerHTML = "₹" + Number(value).toLocaleString();

}


/* ===========================================
   Greeting
=========================================== */

function updateGreeting() {

    const greeting = document.getElementById("greeting");

    if (!greeting) return;

    const hour = new Date().getHours();

    if (hour < 12) {

        greeting.innerHTML = "Good Morning ☀️";

    }

    else if (hour < 17) {

        greeting.innerHTML = "Good Afternoon 🌤";

    }

    else {

        greeting.innerHTML = "Good Evening 🌙";

    }

}


/* ===========================================
   Month Filter
=========================================== */

const monthInput = document.getElementById("monthFilter");

if (monthInput) {

    monthInput.value = new Date().toISOString().substring(0, 7);

    monthInput.addEventListener("change", () => {

        if (typeof renderTransactions === "function") {

            renderTransactions();

        }

    });

}


/* ===========================================
   Dashboard Refresh
=========================================== */

function refreshDashboard() {

    calculateDashboard();

    updateGreeting();

}

refreshDashboard();

setInterval(refreshDashboard, 30000);
