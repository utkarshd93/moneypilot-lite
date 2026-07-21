/* =====================================================
            Net Worth
===================================================== */

function loadNetWorthSummary() {

    const cashBalance = document.getElementById("cashBalance");
    const investment = document.getElementById("investmentTotal");

    const cashBalanceWorth = document.getElementById("cashBalanceWorth");
    const investmentWorth = document.getElementById("investmentWorth");

    if (cashBalance && cashBalanceWorth) {
        cashBalanceWorth.textContent = cashBalance.textContent;
    }

    if (investment && investmentWorth) {
        investmentWorth.textContent = investment.textContent;
    }

    document.getElementById("assetTotal").textContent = "₹0";

    document.getElementById("liabilityTotal").textContent = "₹0";

    document.getElementById("totalWorthValue").textContent =
        cashBalance.textContent;

}

/* =====================================================
        Net Worth Action Sheet
===================================================== */

const addNetWorthBtn =
document.getElementById("addNetWorth");

const netWorthSheet =
document.getElementById("netWorthActionSheet");

const cancelNetWorthSheet =
document.getElementById("cancelNetWorthSheet");

if(addNetWorthBtn){

    addNetWorthBtn.onclick=function(){

        netWorthSheet.classList.add("show");

    };

}

if(cancelNetWorthSheet){

    cancelNetWorthSheet.onclick=function(){

        netWorthSheet.classList.remove("show");

    };

}

window.addEventListener(

"click",

function(e){

    if(e.target===netWorthSheet){

        netWorthSheet.classList.remove("show");

    }

});
