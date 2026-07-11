/* ===================================================
        MoneyPilot Premium V2
        Transactions Engine
=================================================== */

let transactions = [];

let editTransactionId = null;

const STORAGE_KEY = "moneypilot_transactions";

/* ===================================================
                Categories
=================================================== */

const CATEGORY_ICONS = {

    Food:"🍔",

    Fuel:"⛽",

    Shopping:"🛍",

    Salary:"💼",

    Investment:"📈",

    Travel:"✈️",

    Health:"🏥",

    Recharge:"📱",

    Entertainment:"🎬",

    Other:"📦"

};

/* ===================================================
                Storage
=================================================== */

function loadTransactions(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(data){

        try{

            transactions = JSON.parse(data);

        }

        catch(e){

            transactions=[];

        }

    }

}

function saveTransactions(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(transactions)

    );

}

/* ===================================================
                Helpers
=================================================== */

function generateId(){

    return Date.now();

}

function formatMoney(amount){

    return "₹"+

    Number(amount)

    .toLocaleString(

    "en-IN"

    );

}

function formatDate(date){

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

/* ===================================================
            Category Icon
=================================================== */

function getIcon(category){

    return CATEGORY_ICONS[category]

    ||

    "📦";

}
/* ===================================================
                Save Transaction
=================================================== */

const saveButton = document.getElementById("saveButton");

if(saveButton){

    saveButton.addEventListener("click", saveTransaction);

}

function saveTransaction(){

    const amount = Number(

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

    /* ---------------- Validation ---------------- */

    if(amount<=0){

        alert("Enter valid amount");

        return;

    }

    const transaction={

        id:

        editTransactionId

        ||

        generateId(),

        amount,

        note,

        date,

        type,

        category,

        fixed,

        repeat,

        createdAt:

        new Date().toISOString()

    };

    /* ---------------- Edit ---------------- */

    if(editTransactionId){

        const index=

        transactions.findIndex(

        t=>t.id===editTransactionId

        );

        if(index>-1){

            transactions[index]=transaction;

        }

        editTransactionId=null;

        saveButton.innerHTML=

        "💾 Save Transaction";

    }

    else{

        transactions.unshift(

        transaction

        );

    }

    saveTransactions();

    renderTransactions();

    refreshDashboard();

    clearTransactionForm();

    showToast(

    "Transaction Saved"

    );

}

/* ===================================================
            Clear Form
=================================================== */

function clearTransactionForm(){

    document.getElementById("amount").value="";

    document.getElementById("note").value="";

    document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

    document.getElementById("type").value="expense";

    document.getElementById("category").value="Other";

    document.getElementById("fixedExpense").checked=false;

    document.getElementById("repeatMonthly").checked=false;

}

/* ===================================================
            Empty State
=================================================== */

function toggleEmptyState(){

    const empty=

    document.getElementById(

    "emptyState"

    );

    const list=

    document.getElementById(

    "transactionList"

    );

    if(transactions.length===0){

        empty.style.display="block";

        list.style.display="none";

    }

    else{

        empty.style.display="none";

        list.style.display="block";

    }

}
/* ===================================================
            Render Transactions
=================================================== */

function renderTransactions(){
        const selectedMonth =
document.getElementById("monthFilter").value;

const filteredTransactions =
transactions.filter(t=>{

    if(!selectedMonth) return true;

    return t.date.startsWith(selectedMonth);

});

    const container =

    document.getElementById(

    "transactionList"

    );

    if(!container) return;

    container.innerHTML="";

    toggleEmptyState();

    filteredTransactions.forEach(transaction=>{

        const icon=

        getIcon(

        transaction.category

        );

        const amountClass=

        transaction.type==="income"

        ?

        "incomeText"

        :

        "expenseText";

        const sign=

        transaction.type==="income"

        ?

        "+"

        :

        "-";

        container.innerHTML+=`

<div class="transactionItem">

<div class="transactionLeft">

<div class="transactionIcon">

${icon}

</div>

<div class="transactionInfo">

<h3>

${transaction.category}

</h3>

<p>

${transaction.note}

</p>

<small>

${formatDate(transaction.date)}

</small>

</div>

</div>

<div class="transactionRight">

<div class="${amountClass}">

${sign}${formatMoney(transaction.amount)}

</div>

<div class="transactionButtons">

<button

class="editBtn"

onclick="editTransaction(${transaction.id})">

✏️

</button>

<button

class="deleteBtn"

onclick="deleteTransaction(${transaction.id})">

🗑

</button>

</div>

</div>

</div>

`;

    });

}

/* ===================================================
            Transaction Card Classes
=================================================== */

function getTransactionById(id){

    return transactions.find(

    t=>t.id===id

    );

}
/* ===================================================
            Edit Transaction
=================================================== */

function editTransaction(id){

    const transaction = getTransactionById(id);

    if(!transaction) return;

    editTransactionId = id;

    document.getElementById("amount").value =
    transaction.amount;

    document.getElementById("note").value =
    transaction.note;

    document.getElementById("date").value =
    transaction.date;

    document.getElementById("type").value =
    transaction.type;

    document.getElementById("category").value =
    transaction.category;

    document.getElementById("fixedExpense").checked =
    transaction.fixed;

    document.getElementById("repeatMonthly").checked =
    transaction.repeat;

    document.getElementById("saveButton").innerHTML =
    "✅ Update Transaction";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ===================================================
            Delete Transaction
=================================================== */

function deleteTransaction(id){

    const ok = confirm(

        "Delete this transaction?"

    );

    if(!ok) return;

    transactions = transactions.filter(

        t => t.id !== id

    );

    saveTransactions();

    renderTransactions();

    refreshDashboard();

    toggleEmptyState();

    showToast(

        "Transaction Deleted"

    );

}

/* ===================================================
            Refresh
=================================================== */

function refreshTransactionScreen(){

    renderTransactions();

    refreshDashboard();

    toggleEmptyState();

}

/* ===================================================
            Sort Latest First
=================================================== */

function sortTransactions(){

    transactions.sort(

        (a,b)=>

        new Date(b.date)-

        new Date(a.date)

    );

}
/* ===================================================
            Search (Future Ready)
=================================================== */

function searchTransactions(keyword){

    keyword = keyword.toLowerCase();

    return transactions.filter(t =>

        t.note.toLowerCase().includes(keyword) ||

        t.category.toLowerCase().includes(keyword)

    );

}

/* ===================================================
            Filter By Type
=================================================== */

function getTransactionsByType(type){

    return transactions.filter(

        t => t.type === type

    );

}

/* ===================================================
            Filter By Category
=================================================== */

function getTransactionsByCategory(category){

    return transactions.filter(

        t => t.category === category

    );

}

/* ===================================================
            Monthly Transactions
=================================================== */

function getCurrentMonthTransactions(){

    const monthInput =

    document.getElementById(

    "monthFilter"

    );

    if(!monthInput) return transactions;

    const selectedMonth =

    monthInput.value;

    if(!selectedMonth) return transactions;

    return transactions.filter(

        t =>

        t.date.startsWith(selectedMonth)

    );

}

/* ===================================================
            Initial Load
=================================================== */

function initializeTransactions(){

    loadTransactions();

    sortTransactions();

    renderTransactions();

    toggleEmptyState();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}
document.getElementById("date").value =
new Date().toISOString().split("T")[0];

initializeTransactions();

/* ===================================================
        End of File
=================================================== */
