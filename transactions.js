/* ==========================
   MoneyPilot Transactions
========================== */

let transactions =
    JSON.parse(localStorage.getItem("moneypilot_transactions")) || [];

let editingIndex = -1;

/* --------------------------
   Save Transaction
-------------------------- */

document
.getElementById("saveButton")
.addEventListener("click", saveTransaction);

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

        alert("Enter Amount");

        return;

    }

    if(date===""){

        alert("Select Date");

        return;

    }

    const transaction={

        id:Date.now(),

        amount,

        note,

        date,

        type,

        category,

        fixed,

        repeat

    };

    if(editingIndex==-1){

        transactions.unshift(transaction);

    }else{

        transaction.id=transactions[editingIndex].id;

        transactions[editingIndex]=transaction;

        editingIndex=-1;

    }

    localStorage.setItem(

        "moneypilot_transactions",

        JSON.stringify(transactions)

    );

    clearForm();

    renderTransactions();

}

/* --------------------------
     Clear Form
-------------------------- */

function clearForm(){

    amount.value="";

    note.value="";

    fixedExpense.checked=false;

    repeatMonthly.checked=false;

    type.value="expense";

    category.selectedIndex=0;

    date.valueAsDate=new Date();

}

/* --------------------------
      Render Table
-------------------------- */

function renderTransactions(){

    const tbody=document.getElementById("transactionTable");

    tbody.innerHTML="";

    let balance=0;

    let income=0;

    let expense=0;

    let fixedTotal=0;

    let variableTotal=0;

    transactions.forEach((item,index)=>{

        if(item.type==="income"){

            income+=item.amount;

            balance+=item.amount;

        }else{

            expense+=item.amount;

            balance-=item.amount;

            if(item.fixed)

                fixedTotal+=item.amount;

            else

                variableTotal+=item.amount;

        }

        tbody.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.category}</td>

<td>${item.note}</td>

<td class="${
item.type==="income"
?
"incomeText"
:
"expenseText"
}">

${item.type==="income"?"+":"-"}

₹${item.amount}

</td>

<td>

<button onclick="editTransaction(${index})">

✏️

</button>

<button onclick="deleteTransaction(${index})">

🗑️

</button>

</td>

</tr>

`;

    });

    balance.innerHTML="₹"+balance.toLocaleString();

    incomeValue.innerHTML="₹"+income.toLocaleString();

    expenseValue.innerHTML="₹"+expense.toLocaleString();

    fixedTotal.innerHTML="₹"+fixedTotal.toLocaleString();

    variableTotal.innerHTML="₹"+variableTotal.toLocaleString();

    savingTotal.innerHTML="₹"+(income-expense).toLocaleString();

}

/* --------------------------
      Delete
-------------------------- */

function deleteTransaction(index){

    if(confirm("Delete Transaction?")){

        transactions.splice(index,1);

        localStorage.setItem(

            "moneypilot_transactions",

            JSON.stringify(transactions)

        );

        renderTransactions();

    }

}

/* --------------------------
        Edit
-------------------------- */

function editTransaction(index){

    const t=transactions[index];

    editingIndex=index;

    amount.value=t.amount;

    note.value=t.note;

    date.value=t.date;

    type.value=t.type;

    category.value=t.category;

    fixedExpense.checked=t.fixed;

    repeatMonthly.checked=t.repeat;

}

/* --------------------------
     Initial Load
-------------------------- */

clearForm();

renderTransactions();
