/* ==========================================
   MoneyPilot Lite
   Transactions Engine
========================================== */

let transactions = [];
let editingId = null;

const STORAGE_KEY = "moneypilot_transactions";

/* ==========================================
   Load Data
========================================== */

function loadTransactions(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(data){

        try{

            transactions = JSON.parse(data);

        }

        catch(e){

            transactions = [];

        }

    }

}

/* ==========================================
   Save Data
========================================== */

function saveTransactions(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(transactions)

    );

}

/* ==========================================
   Generate ID
========================================== */

function generateId(){

    return Date.now() + "_" + Math.random();

}

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
    Number(document.getElementById("amount").value);

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

    if(amount<=0){

        alert("Enter valid amount");

        return;

    }

    if(date===""){

        alert("Select date");

        return;

    }

    const obj={

        id:

        editingId

        ?

        editingId

        :

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


    if(editingId){

        const index=

        transactions.findIndex(

        x=>x.id===editingId

        );

        if(index!=-1){

            transactions[index]=obj;

        }

        editingId=null;

    }

    else{

        transactions.unshift(obj);

    }

    saveTransactions();

    clearForm();

    renderTransactions();

    showToast("Transaction Saved");

}


/* ==========================================
   Clear Form
========================================== */

function clearForm(){

    amount.value="";

    note.value="";

    date.valueAsDate=new Date();

    type.value="expense";

    category.selectedIndex=0;

    fixedExpense.checked=false;

    repeatMonthly.checked=false;

}


/* ==========================================
   Edit
========================================== */

function editTransaction(id){

    const t=

    transactions.find(

    x=>x.id===id

    );

    if(!t) return;

    editingId=id;

    amount.value=t.amount;

    note.value=t.note;

    date.value=t.date;

    type.value=t.type;

    category.value=t.category;

    fixedExpense.checked=t.fixed;

    repeatMonthly.checked=t.repeat;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* ==========================================
   Delete
========================================== */

function deleteTransaction(id){

    if(

    !confirm(

    "Delete transaction?"

    )

    )

    return;

    transactions=

    transactions.filter(

    x=>x.id!==id

    );

    saveTransactions();

    renderTransactions();

    showToast("Deleted");

}
/* ==========================================
   Render Transactions
========================================== */

function renderTransactions(){

    const tbody = document.getElementById("transactionTable");
    const emptyState = document.getElementById("emptyState");

    tbody.innerHTML = "";

    let income = 0;
    let expense = 0;
    let fixed = 0;
    let variable = 0;

    if(transactions.length === 0){

        if(emptyState) emptyState.style.display = "block";

    }else{

        if(emptyState) emptyState.style.display = "none";

    }

    transactions.forEach(item=>{

        if(item.type==="income"){

            income += item.amount;

        }else{

            expense += item.amount;

            if(item.fixed){

                fixed += item.amount;

            }else{

                variable += item.amount;

            }

        }

        tbody.innerHTML += `

<tr>

<td>${item.date}</td>

<td>${item.category}</td>

<td>${item.note || "-"}</td>

<td class="${item.type==="income"?"incomeText":"expenseText"}">

${item.type==="income"?"+":"-"}

₹${item.amount.toLocaleString()}

</td>

<td>

<button onclick="editTransaction('${item.id}')">

✏️

</button>

<button onclick="deleteTransaction('${item.id}')">

🗑️

</button>

</td>

</tr>

`;

    });

    updateDashboard(

        income,

        expense,

        fixed,

        variable

    );

}



/* ==========================================
   Dashboard
========================================== */

function updateDashboard(

income,

expense,

fixed,

variable

){

    const balance = income-expense;

    document.getElementById("balance").innerHTML =
        "₹"+balance.toLocaleString();

    document.getElementById("incomeValue").innerHTML =
        "₹"+income.toLocaleString();

    document.getElementById("expenseValue").innerHTML =
        "₹"+expense.toLocaleString();

    document.getElementById("fixedTotal").innerHTML =
        "₹"+fixed.toLocaleString();

    document.getElementById("variableTotal").innerHTML =
        "₹"+variable.toLocaleString();

    document.getElementById("savingTotal").innerHTML =
        "₹"+balance.toLocaleString();

}



/* ==========================================
   Month Filter
========================================== */

const monthFilter = document.getElementById("monthFilter");

if(monthFilter){

    monthFilter.value = new Date().toISOString().substring(0,7);

    monthFilter.addEventListener("change",()=>{

        const selected = monthFilter.value;

        if(selected===""){

            renderTransactions();

            return;

        }

        const old = [...transactions];

        transactions = old.filter(t=>t.date.startsWith(selected));

        renderTransactions();

        transactions = old;

    });

}



/* ==========================================
   Initial Load
========================================== */

loadTransactions();

renderTransactions();

document.getElementById("date").valueAsDate =
new Date();
