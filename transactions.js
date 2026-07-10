/* ==========================================
   MoneyPilot Lite
   transactions.js (Part 1)
========================================== */

let transactions =
JSON.parse(
localStorage.getItem("moneypilot_transactions")
) || [];

let editingIndex = -1;


/* ==========================================
   Save Button
========================================== */

document
.getElementById("saveButton")
.addEventListener("click", saveTransaction);



/* ==========================================
   Save Transaction
========================================== */

function saveTransaction(){

    const amount =
    parseFloat(
        document.getElementById("amount").value
    );

    const note =
    document.getElementById("note").value.trim();

    const date =
    document.getElementById("date").value;

    const type =
    document.getElementById("type").value;

    const category =
    document.getElementById("category").value;

    const fixed =
    document.getElementById("fixedExpense").checked;

    const repeat =
    document.getElementById("repeatMonthly").checked;


    if(isNaN(amount) || amount<=0){

        alert("Please enter valid amount.");

        return;

    }

    if(date==""){

        alert("Please select date.");

        return;

    }


    const transaction={

        id:Date.now(),

        amount:amount,

        note:note,

        date:date,

        type:type,

        category:category,

        fixed:fixed,

        repeat:repeat

    };


    if(editingIndex==-1){

        transactions.unshift(transaction);

    }

    else{

        transaction.id=
        transactions[editingIndex].id;

        transactions[editingIndex]=transaction;

        editingIndex=-1;

    }


    saveStorage();

    clearForm();

    renderTransactions();

}



/* ==========================================
   Save Storage
========================================== */

function saveStorage(){

    localStorage.setItem(

        "moneypilot_transactions",

        JSON.stringify(transactions)

    );

}



/* ==========================================
   Clear Form
========================================== */

function clearForm(){

    document.getElementById("amount").value="";

    document.getElementById("note").value="";

    document.getElementById("date").valueAsDate=

    new Date();

    document.getElementById("type").value="expense";

    document.getElementById("category").selectedIndex=0;

    document.getElementById("fixedExpense").checked=false;

    document.getElementById("repeatMonthly").checked=false;

}



/* ==========================================
   Delete Transaction
========================================== */

function deleteTransaction(index){

    if(!confirm("Delete Transaction ?"))

        return;

    transactions.splice(index,1);

    saveStorage();

    renderTransactions();

}



/* ==========================================
   Edit Transaction
========================================== */

function editTransaction(index){

    const t=transactions[index];

    editingIndex=index;

    document.getElementById("amount").value=t.amount;

    document.getElementById("note").value=t.note;

    document.getElementById("date").value=t.date;

    document.getElementById("type").value=t.type;

    document.getElementById("category").value=t.category;

    document.getElementById("fixedExpense").checked=t.fixed;

    document.getElementById("repeatMonthly").checked=t.repeat;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



/* ==========================================
   Initial Date
========================================== */

document
.getElementById("date")
.valueAsDate=new Date();
/* ==========================================
   Render Transactions
========================================== */

function renderTransactions(){

    const tbody =
    document.getElementById("transactionTable");

    tbody.innerHTML = "";

    let balanceAmount = 0;
    let incomeAmount = 0;
    let expenseAmount = 0;
    let fixedExpense = 0;
    let variableExpense = 0;

    transactions.forEach((item,index)=>{

        if(item.type==="income"){

            incomeAmount += item.amount;
            balanceAmount += item.amount;

        }else{

            expenseAmount += item.amount;
            balanceAmount -= item.amount;

            if(item.fixed){

                fixedExpense += item.amount;

            }else{

                variableExpense += item.amount;

            }

        }

        tbody.innerHTML += `

<tr>

<td>${item.date}</td>

<td>${item.category}</td>

<td>${item.note}</td>

<td class="${item.type==="income"
?
"incomeText"
:
"expenseText"}">

${item.type==="income" ? "+" : "-"}

₹${item.amount.toLocaleString()}

</td>

<td>

<button
onclick="editTransaction(${index})">

✏️

</button>

<button
onclick="deleteTransaction(${index})">

🗑️

</button>

</td>

</tr>

`;

    });

    updateDashboard(

        balanceAmount,

        incomeAmount,

        expenseAmount,

        fixedExpense,

        variableExpense

    );

}



/* ==========================================
   Dashboard Update
========================================== */

function updateDashboard(

balance,

income,

expense,

fixed,

variable

){

    document
    .getElementById("balance")
    .innerHTML =
    "₹"+balance.toLocaleString();

    document
    .getElementById("incomeValue")
    .innerHTML =
    "₹"+income.toLocaleString();

    document
    .getElementById("expenseValue")
    .innerHTML =
    "₹"+expense.toLocaleString();

    document
    .getElementById("fixedTotal")
    .innerHTML =
    "₹"+fixed.toLocaleString();

    document
    .getElementById("variableTotal")
    .innerHTML =
    "₹"+variable.toLocaleString();

    document
    .getElementById("savingTotal")
    .innerHTML =
    "₹"+(income-expense).toLocaleString();

}



/* ==========================================
   Search By Month
========================================== */

function filterByMonth(month){

    if(month===""){

        renderTransactions();

        return;

    }

    const tbody =
    document.getElementById("transactionTable");

    tbody.innerHTML="";

    transactions.forEach((item,index)=>{

        if(!item.date.startsWith(month))

            return;

        tbody.innerHTML += `

<tr>

<td>${item.date}</td>

<td>${item.category}</td>

<td>${item.note}</td>

<td class="${item.type==="income"
?
"incomeText"
:
"expenseText"}">

${item.type==="income"
?
"+"
:
"-"}

₹${item.amount}

</td>

<td>

<button
onclick="editTransaction(${index})">

✏️

</button>

<button
onclick="deleteTransaction(${index})">

🗑️

</button>

</td>

</tr>

`;

    });

}



/* ==========================================
   Month Filter
========================================== */

const monthFilter =
document.getElementById("monthFilter");

if(monthFilter){

    monthFilter.value =
    new Date()
    .toISOString()
    .substring(0,7);

    monthFilter.addEventListener(

        "change",

        ()=>{

            filterByMonth(

                monthFilter.value

            );

        }

    );

}



/* ==========================================
   First Load
========================================== */

renderTransactions();
