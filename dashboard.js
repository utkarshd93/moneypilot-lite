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

renderBenefitCards();

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
        Benefit Cards Dashboard
===================================================== */

function renderBenefitCards(){

    const section =
    document.getElementById(
        "benefitCardSection"
    );

    const list =
    document.getElementById(
        "benefitCardList"
    );

    if(!section || !list){

        return;

    }

    const cards =
    getBenefitCards();

    if(cards.length===0){

        section.classList.add("hidden");

        list.innerHTML="";

        return;

    }

    const month =
    document.getElementById(
        "monthFilter"
    )?.value || "";

    section.classList.remove(
        "hidden"
    );

    list.innerHTML="";

    cards.forEach(card=>{

        const summary =
        getBenefitSummary(
            card.category,
            month
        );

        if(!summary){

            return;

        }

        list.innerHTML += `

<div
class="benefitCard clickableBenefitCard"
onclick="openBenefitAnalytics('${summary.category}')">

<div class="benefitHeader">

<div>

<h3>${summary.category}</h3>

<p>

Available Balance

</p>

</div>

<div class="benefitActions">

<h2>

₹${summary.availableBalance.toLocaleString("en-IN")}

</h2>

<button
class="benefitSettingsBtn"
onclick="editBenefitBalance('${summary.category}')">

⚙️

</button>

</div>

</div>

<div class="benefitStats">

<div>

<span>Loaded</span>

<strong>

₹${summary.monthlyLoaded.toLocaleString("en-IN")}

</strong>

</div>

<div>

<span>Spent</span>

<strong>

₹${summary.monthlySpent.toLocaleString("en-IN")}

</strong>

</div>

</div>

</div>

`;

    });

}

function openBenefitAnalytics(category){

    sessionStorage.setItem(
        "selectedBenefitCard",
        category
    );

    sessionStorage.setItem(
        "analyticsFilter",
        "benefit"
    );

    openPage("analytics");

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

    openPage("analytics");

}

document.addEventListener("DOMContentLoaded", () => {

    const incomeCard =
        document.querySelector(".incomeCard");

    const expenseCard =
        document.querySelector(".expenseCard");

    const investmentCard =
        document.querySelector(".investmentCard");

    if (incomeCard) {

        incomeCard.style.cursor = "pointer";

        incomeCard.addEventListener("click", () => {

            openAnalytics("income");

        });

    }

    if (expenseCard) {

        expenseCard.style.cursor = "pointer";

        expenseCard.addEventListener("click", () => {

            openAnalytics("expense");

        });

    }

    if (investmentCard) {

        investmentCard.style.cursor = "pointer";

        investmentCard.addEventListener("click", () => {

            openAnalytics("investment");

        });

    }

});
