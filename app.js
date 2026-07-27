/* =====================================================
            MoneyPilot Lite V3
===================================================== */
function trackEvent(eventName,params={}){

    if(typeof gtag==="function"){

        gtag("event",eventName,params);

    }

}

document.addEventListener("DOMContentLoaded", function () {

    initializeApp();

});

function initializeApp() {

    // Load Local Storage
    if (typeof loadStorage === "function") {

        loadStorage();

    }

    if(typeof loadSettings==="function"){

    loadSettings();

    }

    if (typeof loadBills === "function") {

        loadBills();

    }

    if(typeof scanBenefitCards==="function"){

    scanBenefitCards();

    }

    // Dashboard
    if (typeof refreshDashboard === "function") {

        refreshDashboard();

    }

    // Transactions
    if (typeof renderTransactions === "function") {

        renderTransactions();

    }

    // Bills
    if (typeof renderBills === "function") {

        renderBills();

    }

    initializeMonth();

}
/* =====================================================
        Sync Transaction Date With Month
===================================================== */

function syncTransactionDate(){

    const monthFilter =
    document.getElementById("monthFilter");

    const dateInput =
    document.getElementById("date");

    if(!monthFilter || !dateInput) return;

    const selectedMonth = monthFilter.value;

    if(!selectedMonth) return;

    const today = new Date();

    const currentMonth = today.toISOString().substring(0,7);

    if(selectedMonth === currentMonth){

        dateInput.value =
        today.toISOString().substring(0,10);

    }

    else{

        dateInput.value =
        selectedMonth + "-01";

    }

}
function initializeMonth() {

    const monthFilter =

    document.getElementById("monthFilter");

    if (!monthFilter) return;

    if (!monthFilter.value) {

        monthFilter.value =

        new Date()

        .toISOString()

        .substring(0, 7);

    }

}
function refreshApp() {

    if (typeof refreshDashboard === "function") {

        refreshDashboard();

    }

    if (typeof renderTransactions === "function") {

        renderTransactions();

    }

}
function showHome() {

    if (typeof openPage === "function") {

        openPage("home");

    }

}

function showTransactions() {

    if (typeof openPage === "function") {

        openPage("transactions");

    }

}

function showAnalytics() {

    if (typeof openPage === "function") {

        openPage("analytics");

    }

}

function showSettings() {

    if (typeof openPage === "function") {

        openPage("settings");

    }

}
/* =====================================================
            Month Navigation
===================================================== */

const monthFilter =
document.getElementById("monthFilter");

const prevMonth =
document.getElementById("prevMonth");

const nextMonth =
document.getElementById("nextMonth");

function changeMonth(offset){

    if(!monthFilter) return;

    let value = monthFilter.value;

    if(!value){

        value = new Date()
        .toISOString()
        .substring(0,7);

    }

    let parts = value.split("-");

    let year = parseInt(parts[0]);

    let month = parseInt(parts[1]);

    month += offset;

    if(month < 1){

        month = 12;

        year--;

    }

    if(month > 12){

        month = 1;

        year++;

    }

    monthFilter.value =
    year + "-" +
    String(month).padStart(2,"0");

    monthFilter.dispatchEvent(
        new Event("change")
    );

}
if(prevMonth){

    prevMonth.onclick=function(){

        changeMonth(-1);

    };

}

if(nextMonth){

    nextMonth.onclick=function(){

        changeMonth(1);

    };

}
/* =====================================================
            Save Transaction
===================================================== */

const saveButton =
document.getElementById("saveButton");

if(saveButton){

saveButton.onclick = function(){

    let success = false;

    if(typeof addTransaction === "function"){

        success = addTransaction();

    }

    else if(typeof saveTransaction === "function"){

        success = saveTransaction();

    }

    if(!success){

        return;
    }

    refreshApp();

    if(typeof closeBottomSheet === "function"){

        closeBottomSheet();

    }

};

}
/* =====================================================
            Month Change
===================================================== */

if(monthFilter){

monthFilter.addEventListener(

"change",

function(){

    syncTransactionDate();

    refreshApp();

}

);

}
/* =====================================================
            Refresh Every Minute
===================================================== */

setInterval(function(){

    refreshDashboard();

},60000);
/* =====================================================
            Recent Transactions
===================================================== */

function renderRecentTransactions(){

    const container =
    document.getElementById("recentTransactionList");

    if(!container) return;

    container.innerHTML = "";

    if(typeof transactions === "undefined") return;

    const selectedMonth =
    document.getElementById("monthFilter")?.value || "";

    let filtered = transactions;

    if(selectedMonth){

        filtered = transactions.filter(t =>
            t.date &&
            t.date.startsWith(selectedMonth)
        );

    }

    filtered = filtered
        .slice()
        .reverse()
        .slice(0,5);

    if(filtered.length===0){

        container.innerHTML =

        "<p class='textCenter'>No transactions found.</p>";

        return;

    }

    filtered.forEach(t=>{

        const cls =
t.type==="income"
? "incomeText"
: t.type==="investment"
? "investmentText"
: "expenseText";

let sign = "-";

if(t.type==="income"){

    sign = "+";

}

else if(t.type==="investment"){

    sign = "";

}

        container.innerHTML += `

<div class="transactionItem">

<div class="transactionLeft">

<div class="transactionIcon">

${getCategoryIcon(t.category)}

</div>

<div class="transactionInfo">

<h3>${t.category}</h3>

<p>${t.note || "-"}</p>

<small>${t.date}</small>

</div>

</div>

<div class="transactionRight">

<div class="${cls}">

${sign} ₹${Number(t.amount).toLocaleString()}

</div>

</div>

</div>

`;

    });

}


function refreshCategoryFilter(){

    const typeFilter =
    document.getElementById("transactionTypeFilter");

    const categoryFilter =
    document.getElementById("categoryFilter");

    if(!typeFilter || !categoryFilter){

        return;

    }

    categoryFilter.innerHTML="";

    categoryFilter.value="";

    const first =
    document.createElement("option");

    first.value="";

    first.textContent="All Categories";

    categoryFilter.appendChild(first);

    let categories=[];

    if(typeFilter.value==="expense"){

        categories=getAllCategories("expense");

    }

    else if(typeFilter.value==="income"){

        categories=getAllCategories("income");

    }

    else if(typeFilter.value==="investment"){

        categories=getAllCategories("investment");

    }

    else{

        categories=[
            ...new Set([
                ...getAllCategories("expense"),
                ...getAllCategories("income"),
                ...getAllCategories("investment")
            ])
        ];

    }

    categories.sort().forEach(function(item){

        const option=
        document.createElement("option");

        option.value=item;

        option.textContent=item;

        categoryFilter.appendChild(option);

    });

}


/* =====================================================
            Search
===================================================== */

const searchBox =
document.getElementById("searchTransaction");

if(searchBox){

searchBox.addEventListener(

"input",

function(){

    if(typeof renderTransactions==="function"){

        renderTransactions();

    }

}

);

}

const typeFilter =
document.getElementById("transactionTypeFilter");

if(typeFilter){

    typeFilter.addEventListener(

        "change",

        function(){

            refreshCategoryFilter();

            renderTransactions();

        }

    );

}

const categoryFilter =
document.getElementById("categoryFilter");

if(categoryFilter){

    categoryFilter.addEventListener(

        "change",

        renderTransactions

    );

}
/* =====================================================
            Refresh Everything
===================================================== */

function fullRefresh(){

    refreshApp();

    renderRecentTransactions();

}
/* =====================================================
            First Load
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    refreshCategoryFilter();

    fullRefresh();

});
/* =====================================================
            App Loaded
===================================================== */

console.log(

"✅ MoneyPilot Lite V3 Loaded"

);

