/* =====================================================
        MoneyPilot Lite V3
        Dashboard
===================================================== */

function calculateDashboard(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    const list =

    getTransactionsByMonth(month);

    let income = 0;

    let expense = 0;

    let investment = 0;

    let fixed = 0;

    let variable = 0;
       list.forEach(t=>{

        const amount = Number(t.amount)||0;

        switch(t.type){

            case "income":

                income += amount;

                break;

            case "expense":

                expense += amount;

                if(t.fixed){

                    fixed += amount;

                }

                else{

                    variable += amount;

                }

                break;

            case "investment":

                investment += amount;

                break;

        }

    });

const cashBalance =

income -

expense -

investment;

const netWorth =

cashBalance +

investment;

updateValue(

    "balance",

    cashBalance

);

updateValue(

    "incomeValue",

    income

);

updateValue(

    "expenseValue",

    expense

);

updateValue(

    "cashBalance",

    cashBalance

);

updateValue(

    "investmentTotal",

    investment

);

updateValue(

    "netWorth",

    netWorth

);

updateValue(

    "analyticsFixed",

    fixed

);

updateValue(

    "analyticsVariable",

    variable

);
}
/* =====================================================
        Update Values
===================================================== */

function updateValue(id,value){

    const el =

    document.getElementById(id);

    if(!el) return;

    el.innerHTML =

    "₹"+

    Number(value)

    .toLocaleString("en-IN");

}
/* =====================================================
        Greeting
===================================================== */

function updateGreeting(){

    const greeting =
    document.getElementById("greeting");

    const userName =
    document.getElementById("userName");

    if(!greeting || !userName){

        return;

    }

    const hour =
    new Date().getHours();

    let text="";

    if(hour<12){

        text="Good Morning ☀️";

    }

    else if(hour<17){

        text="Good Afternoon 🌤";

    }

    else{

        text="Good Evening 🌙";

    }

    greeting.innerHTML = text;

    userName.innerHTML =

    localStorage.getItem("mp_user_name") || "User";

}
/* =====================================================
        Dashboard Refresh
===================================================== */

function refreshDashboard(){

    calculateDashboard();

    updateGreeting();

}
/* =====================================================
        Month Navigation
===================================================== */

function initializeDashboard(){

    const monthFilter =

    document.getElementById("monthFilter");

    if(!monthFilter) return;

    if(!monthFilter.value){

        monthFilter.value =

        new Date()

        .toISOString()

        .substring(0,7);

    }

    refreshDashboard();

}
/* =====================================================
        Month Change
===================================================== */

const dashboardMonth =

document.getElementById("monthFilter");

if(dashboardMonth){

    dashboardMonth.addEventListener(

        "change",

        function(){

            refreshDashboard();

            if(typeof refreshTransactionUI==="function"){

                refreshTransactionUI();

            }

        }

    );

}
/* =====================================================
        Summary
===================================================== */

function getDashboardSummary(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    const stats =

    getTransactionStatistics();

    return{

        month,

        income:stats.income,

        expense:stats.expense,

        investment:stats.investment,

        balance:

        stats.income -

        stats.expense -

        stats.investment

    };

}
/* =====================================================
        Dashboard Auto Refresh
===================================================== */

setInterval(

function(){

    refreshDashboard();

},

60000

);
/* =====================================================
        Dashboard Start
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    initializeDashboard();

}
);


function openAnalytics(filter){

    sessionStorage.setItem(
        "analyticsFilter",
        filter
    );

    if(typeof showPage==="function"){

        showPage("analytics");

    }else{

        document
            .querySelector('[data-page="analytics"]')
            ?.click();

    }

    if(typeof renderAnalyticsTransactions==="function"){

        setTimeout(renderAnalyticsTransactions,150);

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    document
        .getElementById("incomeValue")
        ?.closest(".summaryCard")
        ?.addEventListener("click",()=>{

            openAnalytics("income");

        });

    document
        .getElementById("expenseValue")
        ?.closest(".summaryCard")
        ?.addEventListener("click",()=>{

            openAnalytics("expense");

        });

    document
        .getElementById("investmentTotal")
        ?.closest(".summaryCard")
        ?.addEventListener("click",()=>{

            openAnalytics("investment");

        });

});
