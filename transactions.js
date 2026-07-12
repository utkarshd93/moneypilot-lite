/* =====================================================
        MoneyPilot Lite V3
        Transactions
===================================================== */

let transactions = [];

let editingTransactionId = null;

/* =====================================================
        Transaction Model
===================================================== */

function createTransactionObject(){

    return{

        id:Date.now(),

        amount:Number(

            document.getElementById("amount").value

        ),

        type:

        document.getElementById("type").value,

        category:

        document.getElementById("category").value,

        note:

        document.getElementById("note").value.trim(),

        date:

        document.getElementById("date").value,

        fixed:

        document.getElementById("fixedExpense").checked,

        repeat:

        document.getElementById("repeatMonthly").checked

    };

}
/* =====================================================
        Validation
===================================================== */

function validateTransaction(){

    const amount =

    document.getElementById("amount").value;

    const date =

    document.getElementById("date").value;

    if(amount==="" || Number(amount)<=0){

        showToast("Enter valid amount");

        return false;

    }

    if(date===""){

        showToast("Select transaction date");

        return false;

    }

    return true;

}
/* =====================================================
        Save Transaction
===================================================== */

function saveTransaction(){

    if(!validateTransaction()){

        return;

    }

    const transaction =

    createTransactionObject();
            if(editingTransactionId){

        const index =

        transactions.findIndex(

            t=>t.id===editingTransactionId

        );

        if(index!==-1){

            transaction.id = editingTransactionId;

            transactions[index]=transaction;

        }

        editingTransactionId=null;

    }

    else{

        if(isDuplicateTransaction(transaction)){

    showToast("Duplicate Transaction");

    return;

}

transactions.push(transaction);

    }
        
afterTransactionChanged();

clearTransactionForm();

if(typeof transactionMiniBar!=="undefined"){

    transactionMiniBar.classList.remove(

        "show"

    );

}

showToast("Transaction Saved");

}
/* =====================================================
        Helpers
===================================================== */

function formatMoney(value){

    return Number(value)

    .toLocaleString(

        "en-IN"

    );

}
/* =====================================================
        Render Transactions
===================================================== */

function renderTransactions(){

    const container =
    document.getElementById("transactionList");

    if(!container) return;

    container.innerHTML="";

    const selectedMonth =
    document.getElementById("monthFilter")?.value || "";

    const search =
    document.getElementById("searchTransaction")?.value
    ?.toLowerCase() || "";

    const typeFilter =
    document.getElementById("transactionTypeFilter")?.value || "";

    const categoryFilter =
    document.getElementById("categoryFilter")?.value || "";

    let filtered =
    [...transactions];
            if(selectedMonth){

        filtered = filtered.filter(t=>

            t.date &&
            t.date.startsWith(selectedMonth)

        );

    }

    if(typeFilter){

        filtered = filtered.filter(

            t=>t.type===typeFilter

        );

    }

    if(categoryFilter){

        filtered = filtered.filter(

            t=>t.category===categoryFilter

        );

    }
            if(search){

        filtered = filtered.filter(t=>{

            return (

                t.category.toLowerCase()

                .includes(search)

                ||

                (t.note||"")

                .toLowerCase()

                .includes(search)

            );

        });

    }
            filtered.sort(

        (a,b)=>

        new Date(b.date)-new Date(a.date)

    );
            if(filtered.length===0){

        container.innerHTML=

        `

        <div class="emptyState">

            <div class="emptyIcon">

                📭

            </div>

            <h2>

                No Transactions

            </h2>

            <p>

                Add your first transaction.

            </p>

        </div>

        `;

        return;

    }
            filtered.forEach(t=>{

        drawTransactionCard(

            container,

            t

        );

    });

}
/* =====================================================
        Draw Transaction Card
===================================================== */

function drawTransactionCard(container, transaction){

    let amountClass = "expenseText";
    let sign = "-";
    let icon = getCategoryIcon(transaction.category);

if(transaction.type==="income"){

    amountClass="incomeText";
    sign="+";

}

else if(transaction.type==="investment"){

    amountClass="investmentText";
    sign="";

}
            container.innerHTML += `

<div class="transactionItem">

<div class="transactionLeft">

<div class="transactionIcon">

${getCategoryIcon(transaction.category)}

</div>

${icon}

</div>

<div class="transactionInfo">

<h3>

${transaction.category}

</h3>

<p>

${transaction.note || "No Description"}

</p>

<small>

${formatDisplayDate(transaction.date)}

</small>

</div>

</div>
<div class="transactionRight">

<div class="${amountClass}">

${sign}₹${formatMoney(transaction.amount)}

</div>

<div class="transactionActions">

<button

class="editTransaction"

onclick="editTransaction(${transaction.id})">

✏️

</button>

<button

class="deleteTransaction"

onclick="deleteTransaction(${transaction.id})">

🗑️

</button>

</div>

</div>

</div>

`;

}
/* =====================================================
        Date Format
===================================================== */

function formatDisplayDate(date){

    if(!date) return "";

    return new Date(date)

    .toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}
/* =====================================================
        Category Icons
===================================================== */

function getCategoryIcon(category){

    const icons={

        Salary:"💼",

        Food:"🍔",

        Fuel:"⛽",

        Shopping:"🛍️",

        Investment:"📈",

        EMI:"🏦",

        Rent:"🏠",

        Health:"🏥",

        Travel:"✈️",

        Entertainment:"🎬",

        Bills:"📄",

        Gift:"🎁",

        Other:"📦"

    };

    return icons[category] || "💳";

}
/* =====================================================
        Edit Transaction
===================================================== */

function editTransaction(id){

    const transaction =

    transactions.find(

        t => t.id === id

    );

    if(!transaction) return;

    editingTransactionId = id;

    document.getElementById("amount").value =
    transaction.amount;

    document.getElementById("type").value =
    transaction.type;

    document.getElementById("category").value =
    transaction.category;

    document.getElementById("note").value =
    transaction.note || "";

    document.getElementById("date").value =
    transaction.date;

    document.getElementById("fixedExpense").checked =
    transaction.fixed;

    document.getElementById("repeatMonthly").checked =
    transaction.repeat;

    if(typeof openBottomSheet==="function"){

        openBottomSheet();

    }

    showToast("Editing Transaction");

}
/* =====================================================
        Delete Transaction
===================================================== */

function deleteTransaction(id){

    if(!confirm(

        "Delete this transaction?"

    )){

        return;

    }

    transactions =

    transactions.filter(

        t => t.id !== id

    );

    afterTransactionChanged();

    showToast("Transaction Deleted");

}
/* =====================================================
        Clear Form
===================================================== */

function clearTransactionForm(){

    document.getElementById("amount").value = "";

    document.getElementById("note").value = "";

    document.getElementById("fixedExpense").checked = false;

    document.getElementById("repeatMonthly").checked = false;

    document.getElementById("type").value = "expense";

    document.getElementById("category").value = "Food";
        if(typeof syncTransactionDate==="function"){

            syncTransactionDate();

        }

    editingTransactionId = null;

}
/* =====================================================
        Transaction Count
===================================================== */

function getTransactionCount(){

    return transactions.length;

}
/* =====================================================
        Total Amount
===================================================== */

function getTotalAmount(type){

    return transactions

    .filter(t=>t.type===type)

    .reduce(

        (total,t)=>

        total + Number(t.amount),

        0

    );

}
/* =====================================================
        Monthly Helpers
===================================================== */

function getTransactionsByMonth(month){

    return transactions.filter(t=>{

        if(!t.date) return false;

        return t.date.startsWith(month);

    });

}

function getCurrentMonthTransactions(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    return getTransactionsByMonth(month);

}
/* =====================================================
        Investment Helpers
===================================================== */

function getInvestments(){

    return transactions.filter(

        t=>t.type==="investment"

    );

}

function getInvestmentTotal(){

    return getInvestments()

    .reduce(

        (total,t)=>

        total+Number(t.amount),

        0

    );

}
/* =====================================================
        Income / Expense Helpers
===================================================== */

function getIncomeTransactions(){

    return transactions.filter(

        t=>t.type==="income"

    );

}

function getExpenseTransactions(){

    return transactions.filter(

        t=>t.type==="expense"

    );

}
/* =====================================================
        Duplicate Check
===================================================== */

function isDuplicateTransaction(transaction){

    return transactions.some(t=>

        t.amount===transaction.amount &&

        t.date===transaction.date &&

        t.type===transaction.type &&

        t.category===transaction.category &&

        t.note===transaction.note

    );

}
/* =====================================================
        Auto Save Hook
===================================================== */

function afterTransactionChanged(){

    if(typeof saveStorage==="function"){

        saveStorage();

    }

    if(typeof fullRefresh==="function"){

        fullRefresh();

    }

}
/* =====================================================
        Initialize Transactions
===================================================== */

function initializeTransactions(){

    if(typeof loadStorage==="function"){

        loadStorage();

    }

    renderTransactions();

    if(typeof renderRecentTransactions==="function"){

        renderRecentTransactions();

    }

}
/* =====================================================
        Transaction Statistics
===================================================== */

function getTransactionStatistics(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    const list =

    getTransactionsByMonth(month);

    return{

        total:list.length,

        income:list
        .filter(t=>t.type==="income")
        .reduce((a,b)=>a+Number(b.amount),0),

        expense:list
        .filter(t=>t.type==="expense")
        .reduce((a,b)=>a+Number(b.amount),0),

        investment:list
        .filter(t=>t.type==="investment")
        .reduce((a,b)=>a+Number(b.amount),0)

    };

}
/* =====================================================
        Recent Transactions
===================================================== */

function getRecentTransactions(limit=5){

    return [...transactions]

    .sort(

        (a,b)=>

        new Date(b.date)-new Date(a.date)

    )

    .slice(0,limit);

}
/* =====================================================
        Refresh UI
===================================================== */

function refreshTransactionUI(){

    renderTransactions();

    if(typeof renderRecentTransactions==="function"){

        renderRecentTransactions();

    }

}
/* =====================================================
        Start Module
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    initializeTransactions();

}

);


