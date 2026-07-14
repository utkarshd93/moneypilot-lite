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

    // Next phase

}

document.addEventListener(

"DOMContentLoaded",

initializeAnalyticsBreakdown

);
