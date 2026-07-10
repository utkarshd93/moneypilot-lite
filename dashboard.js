/* ======================================
   MoneyPilot Dashboard
====================================== */

function refreshDashboard(){

    let income=0;
    let expense=0;
    let fixed=0;
    let variable=0;

    transactions.forEach(t=>{

        if(t.type==="income"){

            income+=Number(t.amount);

        }else{

            expense+=Number(t.amount);

            if(t.fixed){

                fixed+=Number(t.amount);

            }else{

                variable+=Number(t.amount);

            }

        }

    });

    document.getElementById("balance").innerHTML =
        "₹"+(income-expense).toLocaleString();

    document.getElementById("incomeValue").innerHTML =
        "₹"+income.toLocaleString();

    document.getElementById("expenseValue").innerHTML =
        "₹"+expense.toLocaleString();

    document.getElementById("fixedTotal").innerHTML =
        "₹"+fixed.toLocaleString();

    document.getElementById("variableTotal").innerHTML =
        "₹"+variable.toLocaleString();

    document.getElementById("savingTotal").innerHTML =
        "₹"+(income-expense).toLocaleString();

}

setInterval(refreshDashboard,1000);

refreshDashboard();
