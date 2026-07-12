/* =====================================================
            MoneyPilot Lite V3
            Navigation
===================================================== */

const pages = {

home: document.getElementById("homePage"),

transactions: document.getElementById("transactionsPage"),

analytics: document.getElementById("analyticsPage"),

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

hideAllPages();

if(pages[pageName]){

pages[pageName].classList.add("active");

}

if(navButtons[pageName]){

navButtons[pageName].classList.add("active");

}

}
if(navButtons.home){

navButtons.home.addEventListener(

"click",

()=>{

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

let startY=0;

let currentY=0;

let dragging=false;

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

        closeBottomSheet

    );

}

if(transactionMiniBar){

    transactionMiniBar.addEventListener(

        "click",

        restoreBottomSheet

    );

}

let dragElement=null;

dragElement=

document.querySelector(

"#addTransactionSheet .sheetContent"

);

if(dragElement){

dragElement.addEventListener(

"touchstart",

function(e){

startY=

e.touches[0].clientY;

dragging=true;

}

);

dragElement.addEventListener(

"touchmove",

function(e){

if(!dragging) return;

currentY=

e.touches[0].clientY;

const diff=

currentY-startY;

if(diff>0){

bottomSheet.style.transform=

`translateY(${diff}px)`;

}

}

);

dragElement.addEventListener(

"touchend",

function(){

dragging=false;

const diff=

currentY-startY;

bottomSheet.style.transform="";

if(diff>40){

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
