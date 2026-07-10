/* ===========================================
   MoneyPilot Lite
   Dashboard.js
=========================================== */

function calculateDashboard() {

    let income = 0;
    let expense = 0;
    let fixed = 0;
    let variable = 0;

    transactions.forEach(t => {

        const amount = Number(t.amount) || 0;

        if (t.type === "income") {

            income += amount;

        } else {

            expense += amount;

            if (t.fixed) {

                fixed += amount;

            } else {

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
