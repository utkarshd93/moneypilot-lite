/* =====================================================
            MoneyPilot Lite V3
            Navigation
===================================================== */

const pages = {

home: document.getElementById("homePage"),

transactions: document.getElementById("transactionsPage"),

analytics: document.getElementById("analyticsPage"),

netWorth: document.getElementById("netWorthPage"),

settings: document.getElementById("settingsPage")

};

const navButtons = {

home: document.getElementById("navHome"),

transactions: document.getElementById("navTransactions"),

analytics: document.getElementById("navAnalytics"),

settings: document.getElementById("navSettings")

};
function hideAllPages(){

Object.values(pages).forEach(page=>{

if(page){

page.classList.remove("active");

}

});

Object.values(navButtons).forEach(button=>{

if(button){

button.classList.remove("active");

}

});

}
function openPage(pageName){

if(pageName !== "analytics"){

    window.openedFromBenefitCard = false;

}

hideAllPages();

if(pages[pageName]){

pages[pageName].classList.add("active");

}

if(navButtons[pageName]){

navButtons[pageName].classList.add("active");

}
            
/* Analytics Tracking */

trackEvent("page_opened",{

        page:pageName

    });

if(pageName==="analytics"){

    trackEvent("analytics_opened");

    const openedFromBenefit =

        sessionStorage.getItem(
            "selectedBenefitCard"
        );

    if(!sessionStorage.getItem("analyticsFilter") &&
       !openedFromBenefit){

        analyticsMode = null;

        homeAnalyticsFilter = null;

    }

    initAnalyticsBreakdown();

}

}
if(navButtons.home){

navButtons.home.addEventListener(

"click",

()=>{

    sessionStorage.removeItem(
        "selectedBenefitCard"
    );

    openPage("home");

}

);

}

if(navButtons.transactions){

navButtons.transactions.addEventListener(

"click",

()=>{

openPage("transactions");

}

);

}

if(navButtons.analytics){

navButtons.analytics.addEventListener(

"click",

()=>{

openPage("analytics");

}

);

}

if(navButtons.settings){

navButtons.settings.addEventListener(

"click",

()=>{

openPage("settings");

}

);

}
document.addEventListener(

"DOMContentLoaded",

()=>{

openPage("home");

}

);
/* =====================================================
        Floating Action Button
===================================================== */

const fabButton =
document.getElementById("fabButton");

const bottomSheet =
document.getElementById("addTransactionSheet");

const closeSheetButton =
document.getElementById("closeSheetBtn");

const transactionMiniBar =
document.getElementById("transactionMiniBar");

let sheetState="closed";

let startY = 0;

let currentY = 0;

let dragging = false;

let moved = false;

function openBottomSheet(){

    if(sheetState==="open"){

        return;

    }

    if(typeof syncTransactionDate==="function"){

        syncTransactionDate();

    }

    if(bottomSheet){

        bottomSheet.classList.add("show");

        bottomSheet.style.transform="translateY(0px)";

    }

    if(transactionMiniBar){

        transactionMiniBar.classList.remove("show");

    }

    if(fabButton){

        fabButton.style.display="none";

    }

    sheetState="open";

}

function closeBottomSheet(){

    if(typeof clearTransactionForm==="function"){

        clearTransactionForm();

    }

    if(bottomSheet){

        bottomSheet.classList.remove("show");

        bottomSheet.style.transform="translateY(0px)";

    }

    if(transactionMiniBar){

        transactionMiniBar.classList.remove("show");

    }

    if(fabButton){

        fabButton.style.display="flex";

    }

    sheetState="closed";

}

function minimizeBottomSheet(){

    if(bottomSheet){

        bottomSheet.classList.remove("show");

        bottomSheet.style.transform="translateY(0px)";

    }

    if(transactionMiniBar){

        transactionMiniBar.classList.add("show");

    }

    sheetState="minimized";

    if(fabButton){

     fabButton.style.display="none";

    }

}

function restoreBottomSheet(){

    if(bottomSheet){

        bottomSheet.classList.add("show");

    }

    if(transactionMiniBar){

        transactionMiniBar.classList.remove("show");

    }

    sheetState="open";
   
    if(fabButton){

    fabButton.style.display="none";

   }

}

if(fabButton){

    fabButton.addEventListener(

        "click",

        function(){

            if(sheetState==="closed"){

                openBottomSheet();

            }

        }

    );

}

if(closeSheetButton){

    closeSheetButton.addEventListener(

        "click",

        function(e){

            e.stopPropagation();

            dragging = false;

            closeBottomSheet();

        }

    );

}

if(transactionMiniBar){

    transactionMiniBar.addEventListener(

"pointerdown",

function(e){

    e.preventDefault();

    restoreBottomSheet();

}

);

}

const dragElement =

document.querySelector(

"#addTransactionSheet .sheetHeader"

);

if(dragElement){

    dragElement.addEventListener(

        "touchstart",

        function(e){

            if(e.target.closest("#closeSheetBtn")){

                dragging = false;

                return;

            }

            startY = e.touches[0].clientY;

            currentY = startY;

            dragging = true;
            moved = false;

        }

    );

    dragElement.addEventListener(

        "touchmove",

        function(e){

            if(!dragging){

                return;

            }

            currentY = e.touches[0].clientY;

            const diff = currentY - startY;

            if(diff > 0){

                bottomSheet.style.transform =

                `translateY(${Math.min(diff,140)}px)`;

            }

        }

    );

    dragElement.addEventListener(

        "touchend",

        function(){

            if(!dragging){

                return;

            }

            dragging = false;

            const diff = currentY - startY;

            if(Math.abs(diff) > 8){

                moved = true;

            }

            bottomSheet.style.transition = "transform .18s ease";

            bottomSheet.style.transform = "translateY(0px)";

            setTimeout(function(){

                bottomSheet.style.transition = "";

            },180);

            if(moved && diff > 35){

                minimizeBottomSheet();

            }

        }

    );

}


document.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Escape"){

            closeBottomSheet();

        }

    }

);
window.addEventListener(

    "click",

    function(e){

        if(e.target===bottomSheet){

            closeBottomSheet();

        }

    }

);
/* =====================================================
                Toast
===================================================== */

function showToast(message){

    const toast =

    document.getElementById("toast");

    if(!toast) return;

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");

    },2000);

}
/* =====================================================
            Open Transactions
===================================================== */

const viewAllButton =

document.getElementById("viewAllBtn");

if(viewAllButton){

    viewAllButton.onclick=function(){

        openPage("transactions");

    };

}
/* =====================================================
        Default Open
===================================================== */

openPage("home");

/* =====================================================
        Net Worth Navigation
===================================================== */

const netWorthCard = document.getElementById("openNetWorthPage");

const backBtn = document.getElementById("backFromNetWorth");

if(netWorthCard){

    netWorthCard.addEventListener("click",function(){

        loadNetWorthSummary();

        openPage("netWorth");

    });

}

if(backBtn){

    backBtn.addEventListener("click",function(){

    sessionStorage.removeItem(
        "selectedBenefitCard"
    );

    openPage("home");

});

}
