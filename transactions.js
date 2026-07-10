/* ==========================================
   MoneyPilot Lite
   Transactions
========================================== */

let transactions = [];

let editingId = null;


/* ==========================================
   Init
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadStorage();

renderTransactions();

});


/* ==========================================
   Save Button
========================================== */

document

.getElementById("saveButton")

.addEventListener(

"click",

saveTransaction

);


/* ==========================================
   Save Transaction
========================================== */

function saveTransaction(){

const amount=

Number(

document.getElementById(

"amount"

).value

);

const note=

document.getElementById(

"note"

).value.trim();

const date=

document.getElementById(

"date"

).value;

const type=

document.getElementById(

"type"

).value;

const category=

document.getElementById(

"category"

).value;

const fixed=

document.getElementById(

"fixedExpense"

).checked;

const repeat=

document.getElementById(

"repeatMonthly"

).checked;


if(amount<=0){

alert("Enter Amount");

return;

}


if(date==""){

alert("Select Date");

return;

}


const obj={

id:

editingId

?

editingId

:

Date.now(),

amount,

note,

date,

type,

category,

fixed,

repeat

};


if(editingId){

const index=

transactions.findIndex(

x=>x.id==editingId

);

transactions[index]=obj;

editingId=null;

}

else{

transactions.unshift(obj);

}


saveStorage();

renderTransactions();

clearForm();

showToast(

"Saved"

);

}


/* ==========================================
   Clear
========================================== */

function clearForm(){

document.getElementById(

"amount"

).value="";

document.getElementById(

"note"

).value="";

document.getElementById(

"date"

).valueAsDate=

new Date();

document.getElementById(

"type"

).value="expense";

document.getElementById(

"category"

).selectedIndex=0;

document.getElementById(

"fixedExpense"

).checked=false;

document.getElementById(

"repeatMonthly"

).checked=false;

}
/* ==========================================
   Render Transactions
========================================== */

function renderTransactions(){

    const tbody =
    document.getElementById("transactionTable");

    const empty =
    document.getElementById("emptyState");

    tbody.innerHTML="";

    if(transactions.length===0){

        if(empty){

            empty.style.display="block";

        }

    }

    else{

        if(empty){

            empty.style.display="none";

        }

    }

    transactions.sort((a,b)=>{

        return new Date(b.date)-new Date(a.date);

    });

    transactions.forEach(item=>{

        tbody.innerHTML+=`

<tr>

<td>${formatDate(item.date)}</td>

<td>${item.category}</td>

<td>${item.note || "-"}</td>

<td class="${
item.type==="income"
?
"incomeText"
:
"expenseText"
}">

${item.type==="income" ? "+" : "-"}

₹${Number(item.amount).toLocaleString()}

</td>

<td>

<button

onclick="editTransaction(${item.id})">

✏️

</button>

<button

onclick="deleteTransaction(${item.id})">

🗑️

</button>

</td>

</tr>

`;

    });

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}


/* ==========================================
   Edit
========================================== */

function editTransaction(id){

    const item=

    transactions.find(

    x=>x.id==id

    );

    if(!item) return;

    editingId=id;

    document.getElementById("amount").value=item.amount;

    document.getElementById("note").value=item.note;

    document.getElementById("date").value=item.date;

    document.getElementById("type").value=item.type;

    document.getElementById("category").value=item.category;

    document.getElementById("fixedExpense").checked=item.fixed;

    document.getElementById("repeatMonthly").checked=item.repeat;

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

    "Delete Transaction?"

    )

    )

    return;

    transactions=

    transactions.filter(

        x=>x.id!=id

    );

    saveStorage();

    renderTransactions();

    showToast(

        "Deleted"

    );

}
/* ==========================================
   Format Date
========================================== */

function formatDate(dateString){

    if(!dateString) return "-";

    const d = new Date(dateString);

    return d.toLocaleDateString("en-IN",{

        day:"2-digit",

        month:"short",

        year:"numeric"

    });

}


/* ==========================================
   Month Filter
========================================== */

const monthFilter =
document.getElementById("monthFilter");

if(monthFilter){

    monthFilter.value =
    new Date().toISOString().substring(0,7);

    monthFilter.addEventListener(

        "change",

        applyMonthFilter

    );

}

function applyMonthFilter(){

    const selected =
    monthFilter.value;

    if(!selected){

        renderTransactions();

        return;

    }

    const tbody =
    document.getElementById("transactionTable");

    tbody.innerHTML = "";

    const filtered = transactions.filter(t=>
        t.date.startsWith(selected)
    );

    filtered.forEach(item=>{

        tbody.innerHTML += `

<tr>

<td>${formatDate(item.date)}</td>

<td>${item.category}</td>

<td>${item.note || "-"}</td>

<td class="${item.type==="income"
?
"incomeText"
:
"expenseText"}">

${item.type==="income"?"+":"-"}

₹${Number(item.amount).toLocaleString()}

</td>

<td>

<button
onclick="editTransaction(${item.id})">

✏️

</button>

<button
onclick="deleteTransaction(${item.id})">

🗑️

</button>

</td>

</tr>

`;

    });

}


/* ==========================================
   Search (Future Ready)
========================================== */

function searchTransactions(keyword){

    keyword = keyword.toLowerCase();

    return transactions.filter(t=>{

        return (

            (t.note || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (t.category || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

}


/* ==========================================
   Repeat Monthly (Base)
========================================== */

function generateRepeatTransactions(){

    // Sprint 2
    // Full logic yahan add karenge

}


/* ==========================================
   Initial Load
========================================== */

loadStorage();

renderTransactions();

document
.getElementById("date")
.valueAsDate = new Date();
