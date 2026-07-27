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
