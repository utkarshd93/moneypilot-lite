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
function openBottomSheet(){

    if(typeof syncTransactionDate==="function"){

        syncTransactionDate();

    }

    if(bottomSheet){

        bottomSheet.classList.add("show");

    }

}
function closeBottomSheet(){

    if(typeof clearTransactionForm==="function"){

        clearTransactionForm();

    }

    if(bottomSheet){

        bottomSheet.classList.remove("show");

    }

}
if(fabButton){

    fabButton.addEventListener(

        "click",

        openBottomSheet

    );

}

if(closeSheetButton){

    closeSheetButton.addEventListener(

        "click",

        closeBottomSheet

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

const transactionMiniBar =

document.getElementById(

"transactionMiniBar"

);

function minimizeTransactionSheet(){

    if(!bottomSheet) return;

    bottomSheet.classList.remove(

        "show"

    );

    transactionMiniBar.classList.add(

        "show"

    );

}

function restoreTransactionSheet(){

    if(!bottomSheet) return;

    bottomSheet.classList.add(

        "show"

    );

    transactionMiniBar.classList.remove(

        "show"

    );

}

if(transactionMiniBar){

    transactionMiniBar.addEventListener(

        "click",

        restoreTransactionSheet

    );

}
