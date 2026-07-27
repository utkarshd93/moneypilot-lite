/* =====================================================
        MoneyPilot Lite V3
        Benefit Card Engine
===================================================== */

const BENEFIT_VERSION = 1;

let editingBenefitCard = null;

function editBenefitBalance(category){

    editingBenefitCard = category;

    const card = getBenefitCard(category);

    const summary = getBenefitSummary(
        category,
        document.getElementById("monthFilter")?.value || ""
    );

    document
        .getElementById("benefitPopupTitle")
        .textContent = "💳 " + category;

    document
    .getElementById("benefitPopupBalance")
    .textContent =
    "₹" +
    Number(summary?.availableBalance ?? 0)
    .toLocaleString("en-IN");

    document
    .getElementById("benefitCurrentOpeningBalance")
    .textContent =
    "₹" + Number(card.initialBalance)
        .toLocaleString("en-IN");

document
    .getElementById("benefitOpeningBalance")
    .value = "";

    document
        .getElementById("benefitBalancePopup")
        .classList.add("show");

}

function closeBenefitPopup(){

    document
        .getElementById("benefitBalancePopup")
        .classList.remove("show");

    editingBenefitCard = null;

    document
        .getElementById("benefitOpeningBalance")
        .value = "";

    document
        .getElementById("benefitCurrentOpeningBalance")
        .textContent = "₹0";

    document
        .getElementById("benefitPopupTitle")
        .textContent = "";

    document
        .getElementById("benefitPopupBalance")
        .textContent = "₹0";

}

function saveBenefitOpeningBalance(){

    if(!editingBenefitCard){

        return;

    }

    const input = document
    .getElementById("benefitOpeningBalance")
    .value
    .trim();

if(input === ""){

    closeBenefitPopup();

    return;

}

const amount = Number(input);

    updateBenefitInitialBalance(

        editingBenefitCard,

        amount

    );

    closeBenefitPopup();

    refreshDashboard();

    renderBenefitTransactionSummary();

}



function getBenefitRegistry(){

    if(!settings.benefitRegistry){

        settings.benefitRegistry = {};

    }

    return settings.benefitRegistry;

}

function saveBenefitRegistry(){

    saveSettings();

}

function getBenefitCards(){

    return Object.values(

        getBenefitRegistry()

    );

}

function getBenefitCard(name){

    return getBenefitRegistry()[name] || null;

}

function isBenefitCard(name){

    return !!getBenefitCard(name);

}

function registerBenefitCard(category){

    if(!category){

        return;

    }

    const registry =

    getBenefitRegistry();

    if(registry[category]){

        return;

    }

    registry[category] = {

        category,

        enabled:true,

        version:BENEFIT_VERSION,

        initialBalance:0,

        activatedOn:

        new Date().toISOString()

    };

    saveBenefitRegistry();

}

function updateBenefitInitialBalance(

    category,

    amount

){

    const card =

    getBenefitCard(category);

    if(!card){

        return;

    }

    card.initialBalance =

    Number(amount)||0;

    saveBenefitRegistry();

}

function scanBenefitCards(){

    const registry = getBenefitRegistry();

    // Cleanup old invalid entries
    delete registry["Other"];

    saveBenefitRegistry();

    const ignoreCategories = [

        "Other"

    ];

    const expenseCategories =

        getAllCategories("expense")
        .filter(c => !ignoreCategories.includes(c));

    transactions.forEach(t=>{

        if(
            t.type === "income" &&
            expenseCategories.includes(t.category)
        ){

            registerBenefitCard(t.category);

        }

    });

}

function getBenefitSummary(category, month){

    return getBenefitBalanceTillMonth(
        category,
        month
    );

}


/* =====================================================
        Benefit Lifetime Summary
===================================================== */

function getBenefitLifetimeSummary(category){

    const card = getBenefitCard(category);

    if(!card){

        return null;

    }

    let loaded = 0;

    let spent = 0;

    transactions.forEach(t=>{

        if(t.category !== category){

            return;

        }

        if(t.type === "income"){

            loaded += Number(t.amount) || 0;

        }

        else if(t.type === "expense"){

            spent += Number(t.amount) || 0;

        }

    });

    return{

        category,

        initialBalance: card.initialBalance,

        totalLoaded: loaded,

        totalSpent: spent,

        availableBalance:
            card.initialBalance +
            loaded -
            spent

    };

}


/* =====================================================
        Benefit Balance Till Selected Month
===================================================== */

function getBenefitBalanceTillMonth(category, month){

    const card = getBenefitCard(category);

    if(!card){

        return null;

    }

    let loaded = 0;

    let spent = 0;

    let monthlyLoaded = 0;

    let monthlySpent = 0;

    transactions.forEach(t=>{

        if(t.category !== category){

            return;

        }

        const txnMonth = t.date.substring(0,7);

        if(txnMonth > month){

            return;

        }

        if(t.type === "income"){

            loaded += Number(t.amount) || 0;

            if(txnMonth === month){

                monthlyLoaded += Number(t.amount) || 0;

            }

        }

        else if(t.type === "expense"){

            spent += Number(t.amount) || 0;

            if(txnMonth === month){

                monthlySpent += Number(t.amount) || 0;

            }

        }

    });

    return{

        category,

        initialBalance: card.initialBalance,

        totalLoaded: loaded,

        totalSpent: spent,

        monthlyLoaded,

        monthlySpent,

        availableBalance:

            card.initialBalance +

            loaded -

            spent

    };

}


/* =====================================================
        Transaction Benefit Summary
===================================================== */

function renderBenefitTransactionSummary(){

    const section =
        document.getElementById(
            "benefitTransactionSummary"
        );

    const container =
        document.getElementById(
            "benefitTransactionSummaryContent"
        );

    if(!section || !container){
        return;
    }

    const category =
        document.getElementById(
            "categoryFilter"
        )?.value;

    if(
        !category ||
        !isBenefitCard(category)
    ){

        section.classList.add("hidden");
        container.innerHTML = "";

        return;
    }

    const month =
        document.getElementById(
            "monthFilter"
        )?.value || "";

    const summary =
        getBenefitSummary(
            category,
            month
        );

    if(!summary){

        section.classList.add("hidden");

        return;

    }

    container.innerHTML = `

<div class="benefitCard">

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

<span>Opening</span>

<strong>

₹${summary.initialBalance.toLocaleString("en-IN")}

</strong>

</div>

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

    section.classList.remove("hidden");

}


document.addEventListener("DOMContentLoaded", function(){

    document
    .getElementById("cancelBenefitPopup")
    ?.addEventListener(
        "click",
        closeBenefitPopup
    );

    document
    .getElementById("saveBenefitPopup")
    ?.addEventListener(
        "click",
        saveBenefitOpeningBalance
    );

});
