/* =====================================================
        MoneyPilot Lite V3
        Benefit Card Engine
===================================================== */

const BENEFIT_VERSION = 1;

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

function getBenefitSummary(

    category,

    month

){

    const card =

    getBenefitCard(category);

    if(!card){

        return null;

    }

    let income=0;

    let expense=0;

    getTransactionsByMonth(month)

    .forEach(t=>{

        if(

            t.category!==category

        ){

            return;

        }

        if(

            t.type==="income"

        ){

            income +=

            Number(t.amount)||0;

        }

        else if(

            t.type==="expense"

        ){

            expense +=

            Number(t.amount)||0;

        }

    });

    return{

        category,

        initialBalance:

        card.initialBalance,

        loaded:income,

        spent:expense,

        remaining:

        card.initialBalance +

        income -

        expense

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

<p>Available Balance</p>

</div>

<h2>

₹${summary.remaining.toLocaleString("en-IN")}

</h2>

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

₹${summary.loaded.toLocaleString("en-IN")}

</strong>

</div>

<div>

<span>Spent</span>

<strong>

₹${summary.spent.toLocaleString("en-IN")}

</strong>

</div>

</div>

</div>

`;

    section.classList.remove("hidden");

}
