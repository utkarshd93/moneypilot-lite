/* ==========================
   MoneyPilot Dashboard
========================== */

const monthFilter =
document.getElementById("monthFilter");

/* Default Current Month */

window.addEventListener("load",()=>{

    const now=new Date();

    monthFilter.value=
        now.toISOString().substring(0,7);

    generateRecurringTransactions();

    filterTransactions();

});

/* -------------------------
      Month Filter
-------------------------- */

monthFilter.addEventListener(

"change",

filterTransactions

);

function filterTransactions(){

    const month=monthFilter.value;

    if(month===""){

        renderTransactions();

        return;

    }

    const filtered=
        transactions.filter(t=>{

            return t.date.startsWith(month);

        });

    renderFiltered(filtered);

}

/* -------------------------
 Render Filtered Transactions
-------------------------- */

function renderFiltered(data){

    const tbody=
    document.getElementById(
    "transactionTable"
    );

    tbody.innerHTML="";

    let income=0;

    let expense=0;

    let fixed=0;

    let variable=0;

    data.forEach((item,index)=>{

        if(item.type==="income"){

            income+=item.amount;

        }else{

            expense+=item.amount;

            if(item.fixed)

                fixed+=item.amount;

            else

                variable+=item.amount;

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

    const balance=
    income-expense;

    document.getElementById("balance").innerHTML=
    "₹"+balance.toLocaleString();

    document.getElementById("incomeValue").innerHTML=
    "₹"+income.toLocaleString();

    document.getElementById("expenseValue").innerHTML=
    "₹"+expense.toLocaleString();

    document.getElementById("fixedTotal").innerHTML=
    "₹"+fixed.toLocaleString();

    document.getElementById("variableTotal").innerHTML=
    "₹"+variable.toLocaleString();

    document.getElementById("savingTotal").innerHTML=
    "₹"+balance.toLocaleString();

}

/* -------------------------
 Repeat Monthly
-------------------------- */

function generateRecurringTransactions(){

    const currentMonth=
    new Date().toISOString().substring(0,7);

    let changed=false;

    transactions.forEach(item=>{

        if(!item.repeat)
            return;

        const exists=
        transactions.find(x=>

            x.repeat &&

            x.note===item.note &&

            x.category===item.category &&

            x.date.startsWith(currentMonth)

        );

        if(exists)
            return;

        const day=
        item.date.substring(8,10);

        const newDate=
        currentMonth+"-"+day;

        transactions.push({

            ...item,

            id:Date.now()+Math.random(),

            date:newDate

        });

        changed=true;

    });

    if(changed){

        localStorage.setItem(

        "moneypilot_transactions",

        JSON.stringify(transactions)

        );

    }

}
