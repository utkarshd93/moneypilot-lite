/* ===========================================
        MoneyPilot Analytics Breakdown
=========================================== */

let analyticsMode = null;

const analyticsCards = {

    fixed: null,

    variable: null

};

function initializeAnalyticsBreakdown(){

    analyticsCards.fixed =

    document.getElementById(

        "fixedExpenseCard"

    );

    analyticsCards.variable =

    document.getElementById(

        "variableExpenseCard"

    );

    if(analyticsCards.fixed){

        analyticsCards.fixed.addEventListener(

            "click",

            function(){

                selectAnalyticsMode(

                    "fixed"

                );

            }

        );

    }

    if(analyticsCards.variable){

        analyticsCards.variable.addEventListener(

            "click",

            function(){

                selectAnalyticsMode(

                    "variable"

                );

            }

        );

    }

}

function selectAnalyticsMode(mode){

    analyticsMode = mode;

    analyticsCards.fixed

    ?.classList.remove("active");

    analyticsCards.variable

    ?.classList.remove("active");

    if(mode==="fixed"){

        analyticsCards.fixed

        ?.classList.add("active");

    }

    if(mode==="variable"){

        analyticsCards.variable

        ?.classList.add("active");

    }

    refreshAnalyticsBreakdown();

}

function refreshAnalyticsBreakdown(){

    const container =
    document.getElementById("categorySummary");

    if(!container) return;

    const title =
    document.getElementById("analyticsBreakdownTitle");

    if(!title) return;

    const month =
    document.getElementById("monthFilter")?.value || "";

    const transactions =
    getTransactionsByMonth(month);

    let filtered = [];

    if(analyticsMode==="fixed"){

        title.innerHTML =
        "🏠 Fixed Expense Breakdown";

        filtered = transactions.filter(t =>
            t.type==="expense" &&
            t.fixed===true
        );

    }

    else if(analyticsMode==="variable"){

        title.innerHTML =
        "🍔 Variable Expense Breakdown";

        filtered = transactions.filter(t =>
            t.type==="expense" &&
            t.fixed===false
        );

    }

    else{

        title.innerHTML =
        "Transaction Breakdown";

        container.innerHTML =
        `
        <div class="analyticsEmpty">
            Tap Fixed or Variable above
        </div>
        `;

        return;

    }

    renderAnalyticsList(filtered,container);

}

function renderAnalyticsList(list,container){

    if(list.length===0){

        container.innerHTML=

        `
        <div class="analyticsEmpty">

            No transactions found

        </div>
        `;

        return;

    }

    let html="";

    list.forEach(function(t){

        html += `

        <div class="analyticsItem">

            <div>

                <div class="analyticsCategory">

                    ${t.category}

                </div>

                <div class="analyticsDate">

                    ${formatDate(t.date)}

                </div>

            </div>

            <div class="analyticsAmount">

                ₹${Number(t.amount).toLocaleString("en-IN")}

            </div>

        </div>

        `;

    });

    container.innerHTML = html;

}

document.addEventListener(

"DOMContentLoaded",

initializeAnalyticsBreakdown

);
