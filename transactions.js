/* =====================================================
        MoneyPilot Lite V3
        Transactions
===================================================== */

/* =====================================================
                CATEGORY ENGINE
===================================================== */

let editingTransactionId = null;

const DEFAULT_CATEGORIES = {

    expense: [
        "Food",
        "Milk",
        "Tea",
        "Fuel",
        "Shopping",
        "Health",
        "Entertainment",
        "Rent",
        "Travel",
        "Education",
        "Credit Card",
        "Share Market",
        "Gym",
        "Other"
    ],

    income: [
        "Salary",
        "Stock Market",
        "Other"
    ],

    investment: [
        "Stock Market",
        "Other"
    ]

};

function getCustomCategories(type){

    return JSON.parse(

        localStorage.getItem(

            "mp_custom_categories_" + type

        ) || "[]"

    );

}

function saveCustomCategory(type,name){

    name = name.trim();

    if(name==="") return;

    let list = getCustomCategories(type);

    if(list.includes(name)) return;

    list.unshift(name);

    localStorage.setItem(

        "mp_custom_categories_"+type,

        JSON.stringify(list)

    );

}

function getAllCategories(type){

    return [

        ...getCustomCategories(type),

        ...DEFAULT_CATEGORIES[type]

    ];

}

/* =====================================================
        Transaction Model
===================================================== */

function createTransactionObject(){

    return{

        id:Date.now(),

        amount:Number(

            document.getElementById("amount").value

        ),

        type:

        document.getElementById("type").value,

        category:

        document.getElementById("category").value,

        note:

        document.getElementById("note").value.trim(),

        date:

document.getElementById("date").value,

createdAt:

new Date().toISOString(),

fixed:

        document.getElementById("fixedExpense").checked,

        repeat:

        document.getElementById("repeatMonthly").checked

    };

}
/* =====================================================
        Validation
===================================================== */

function validateTransaction(){

    const amount =

    document.getElementById("amount").value;

    const date =

    document.getElementById("date").value;

    const category =

    document.getElementById("category").value;

    if(amount==="" || Number(amount)<=0){

        showToast("Enter valid amount");

        return false;

    }

    if(date===""){

        showToast("Select transaction date");

        return false;

    }

     if(category==="" || category==="__add__"){

    showToast("Please select a category");

    return false;

}

    return true;

}
/* =====================================================
        Save Transaction
===================================================== */

function saveTransaction(){

    if(!validateTransaction()){

    return false;

}

    const transaction =

    createTransactionObject();

        if(transaction.category === "__add__"){

    showToast("Please select a category");

    return;

}
        
            if(editingTransactionId){

        const index =

        transactions.findIndex(

            t=>t.id===editingTransactionId

        );

        if(index!==-1){

            transaction.id = editingTransactionId;

            transactions[index]=transaction;

        }

        editingTransactionId=null;

    }

    else{

    if(transaction.repeat){

        const selectedDate = new Date(transaction.date);

        const year = selectedDate.getFullYear();

        const startMonth = selectedDate.getMonth();

        const day = selectedDate.getDate();

        for(let month=startMonth; month<=11; month++){

            const repeatTransaction={

                ...transaction,

                id:Date.now()+month

            };

            let repeatDate;

if(month === startMonth){

    repeatDate = new Date(year, month, day);

}else{

    repeatDate = new Date(year, month, 1);

}

            repeatTransaction.date =
`${repeatDate.getFullYear()}-${
String(repeatDate.getMonth()+1).padStart(2,"0")
}-${
String(repeatDate.getDate()).padStart(2,"0")
}`;

            if(transaction.fixed){

                const exists=transactions.some(t=>{

                    const d=new Date(t.date);

                    return(

                        t.fixed===true &&

                        t.type===repeatTransaction.type &&

                        t.category===repeatTransaction.category &&

                        Number(t.amount)===Number(repeatTransaction.amount) &&

                        d.getFullYear()===year &&

                        d.getMonth()===month

                    );

                });

                if(exists){

                    continue;

                }

            }

            transactions.push(repeatTransaction);

        }

    }

    else{

        transactions.push(transaction);

    }

}
        
afterTransactionChanged();

trackEvent("transaction_added",{

    type: transaction.type,

    category: transaction.category,

    fixed: transaction.fixed

});

clearTransactionForm();

if(typeof transactionMiniBar!=="undefined"){

    transactionMiniBar.classList.remove(

        "show"

    );

}

showToast("Transaction Saved");

        return true;

}
/* =====================================================
        Helpers
===================================================== */

function formatMoney(value){

    return Number(value)

    .toLocaleString(

        "en-IN"

    );

}
/* =====================================================
        Render Transactions
===================================================== */

function renderTransactions(){

    const container =
    document.getElementById("transactionList");

    if(!container) return;

    container.innerHTML="";

    const selectedMonth =
    document.getElementById("monthFilter")?.value || "";

    const search =
    document.getElementById("searchTransaction")?.value
    ?.toLowerCase() || "";

    const typeFilter =
    document.getElementById("transactionTypeFilter")?.value || "";

    const categoryFilter =
    document.getElementById("categoryFilter")?.value || "";

    let filtered =
    [...transactions];
            if(selectedMonth){

        filtered = filtered.filter(t=>

            t.date &&
            t.date.startsWith(selectedMonth)

        );

    }

    if(typeFilter){

        filtered = filtered.filter(

            t=>t.type===typeFilter

        );

    }

    if(categoryFilter){

        filtered = filtered.filter(

            t=>t.category===categoryFilter

        );

    }
            if(search){

        filtered = filtered.filter(t=>{

            return (

                t.category.toLowerCase()

                .includes(search)

                ||

                (t.note||"")

                .toLowerCase()

                .includes(search)

            );

        });

    }
        
filtered.sort((a, b) => {

    // Newest transaction date first
    const dateDiff =
        new Date(b.date) - new Date(a.date);

    if (dateDiff !== 0) {

        return dateDiff;

    }

    // Same date -> newest transaction first
    return Number(b.id || 0) - Number(a.id || 0);

});
        
            if(filtered.length===0){

        container.innerHTML=

        `

        <div class="emptyState">

            <div class="emptyIcon">

                📭

            </div>

            <h2>

                No Transactions

            </h2>

            <p>

                Add your first transaction.

            </p>

        </div>

        `;

        return;

    }
            filtered.forEach(t=>{

        drawTransactionCard(

            container,

            t

        );

    });

initializeSwipeCards();

}
/* =====================================================
        Draw Transaction Card
===================================================== */

function drawTransactionCard(container, transaction){

    let amountClass = "expenseText";
    let sign = "-";
    let icon = getCategoryIcon(transaction.category);

if(transaction.type==="income"){

    amountClass="incomeText";
    sign="+";

}

else if(transaction.type==="investment"){

    amountClass="investmentText";
    sign="";

}

container.innerHTML += `

<div class="transactionRow">

<div class="transactionSwipeActions">

<button

class="swipeEdit"

onclick="editTransaction(${transaction.id})">

✏️

<span>Edit</span>

</button>

<button

class="swipeDelete"

onclick="deleteTransaction(${transaction.id})">

🗑️

<span>Delete</span>

</button>

</div>

<div

class="transactionItem"

data-id="${transaction.id}">

<div class="transactionTop">

<div class="transactionLeft">

<div class="transactionIcon">

${icon}

</div>

<div class="transactionInfo">

<h3>

${transaction.category}

</h3>

<small>

${formatDisplayDate(transaction.date)}

</small>

</div>

</div>

<div class="transactionAmount ${amountClass}">

${sign}₹${formatMoney(transaction.amount)}

</div>

</div>

<div class="transactionBottom">

<div class="transactionNote">

${transaction.note || transaction.type}

</div>

<div class="transactionMenu">

<button

class="menuButton"

onclick="openTransactionActions(${transaction.id})">

⋮

</button>

</div>

</div>

</div>

</div>

`;

}
/* =====================================================
        Date Format
===================================================== */

function formatDisplayDate(date){

    if(!date) return "";

    return new Date(date)

    .toLocaleDateString(

        "en-IN",

        {

            day:"2-digit",

            month:"short",

            year:"numeric"

        }

    );

}
/* =====================================================
        Category Icons
===================================================== */

function getCategoryIcon(category){

    if(!category) return "💳";

    const text = category.toLowerCase();

    /* Income */

    if(
        text.includes("salary") ||
        text.includes("bonus") ||
        text.includes("incentive") ||
        text.includes("income") ||
        text.includes("freelance") ||
        text.includes("commission")
    ){
        return "💼";
    }

    /* Investments */

    if(
        text.includes("stock") ||
        text.includes("share") ||
        text.includes("mutual") ||
        text.includes("sip") ||
        text.includes("investment") ||
        text.includes("crypto") ||
        text.includes("bitcoin")
    ){
        return "📈";
    }

    if(
        text.includes("gold") ||
        text.includes("silver")
    ){
        return "🪙";
    }

    /* Fuel */

    if(
        text.includes("fuel") ||
        text.includes("petrol") ||
        text.includes("diesel") ||
        text.includes("cng")
    ){
        return "⛽";
    }

    /* Food */

    if(
        text.includes("food") ||
        text.includes("restaurant") ||
        text.includes("hotel") ||
        text.includes("dinner") ||
        text.includes("lunch") ||
        text.includes("breakfast") ||
        text.includes("pizza") ||
        text.includes("burger")
    ){
        return "🍽️";
    }

    if(text.includes("milk")){
        return "🥛";
    }

    if(
        text.includes("tea") ||
        text.includes("coffee")
    ){
        return "☕";
    }

    if(
        text.includes("fruit") ||
        text.includes("vegetable") ||
        text.includes("grocery")
    ){
        return "🛒";
    }

    /* Shopping */

    if(
        text.includes("shopping") ||
        text.includes("amazon") ||
        text.includes("flipkart") ||
        text.includes("clothes")
    ){
        return "🛍️";
    }

    /* Entertainment */

    if(
        text.includes("movie") ||
        text.includes("cinema") ||
        text.includes("netflix") ||
        text.includes("prime") ||
        text.includes("hotstar") ||
        text.includes("entertainment")
    ){
        return "🎬";
    }

    /* Health */

    if(
        text.includes("health") ||
        text.includes("doctor") ||
        text.includes("hospital")
    ){
        return "🏥";
    }

    if(
        text.includes("medicine") ||
        text.includes("medical") ||
        text.includes("pharmacy")
    ){
        return "💊";
    }

    if(
        text.includes("gym") ||
        text.includes("fitness")
    ){
        return "💪";
    }

    /* Home */

    if(text.includes("rent")){
        return "🏠";
    }

    if(
        text.includes("emi") ||
        text.includes("loan")
    ){
        return "🏦";
    }

    /* Travel */

    if(
        text.includes("flight") ||
        text.includes("air")
    ){
        return "✈️";
    }

    if(
        text.includes("uber") ||
        text.includes("ola") ||
        text.includes("cab") ||
        text.includes("taxi")
    ){
        return "🚕";
    }

    if(text.includes("train")){
        return "🚆";
    }

    if(text.includes("bus")){
        return "🚌";
    }

    /* Utilities */

    if(text.includes("electricity")){
        return "⚡";
    }

    if(text.includes("water")){
        return "🚰";
    }

    if(
        text.includes("mobile") ||
        text.includes("recharge")
    ){
        return "📱";
    }

    if(
        text.includes("internet") ||
        text.includes("wifi")
    ){
        return "🌐";
    }

    /* Finance */

    if(
        text.includes("credit") ||
        text.includes("card")
    ){
        return "💳";
    }

    /* Gifts */

    if(text.includes("gift")){
        return "🎁";
    }

    if(
        text.includes("donation") ||
        text.includes("charity")
    ){
        return "❤️";
    }

    /* Education */

    if(
        text.includes("school") ||
        text.includes("college") ||
        text.includes("education") ||
        text.includes("course")
    ){
        return "📚";
    }

    return "💳";

}

/* =====================================================
        Edit Transaction
===================================================== */

function editTransaction(id){

    const transaction =

    transactions.find(

        t => t.id === id

    );

    if(!transaction) return;

    editingTransactionId = id;

    document.getElementById("amount").value =
    transaction.amount;

    document.getElementById("type").value =
    transaction.type;

    document.getElementById("category").value =
    transaction.category;

    document.getElementById("note").value =
    transaction.note || "";

    document.getElementById("date").value =
    transaction.date;

    document.getElementById("fixedExpense").checked =
    transaction.fixed;

    document.getElementById("repeatMonthly").checked =
    transaction.repeat;

    if(typeof openBottomSheet==="function"){

        openBottomSheet();

    }

    showToast("Editing Transaction");

}
/* =====================================================
        Delete Transaction
===================================================== */

function deleteTransaction(id){

    if(!confirm(

        "Delete this transaction?"

    )){

        return;

    }

    transactions =

    transactions.filter(

        t => t.id !== id

    );

    afterTransactionChanged();

    showToast("Transaction Deleted");

}
/* =====================================================
        Clear Form
===================================================== */

function clearTransactionForm(){

    document.getElementById("amount").value = "";

    document.getElementById("note").value = "";

    document.getElementById("fixedExpense").checked = false;

    document.getElementById("repeatMonthly").checked = false;

    document.getElementById("type").value = "expense";
        refreshCategoryDropdown();

    document.getElementById("category").value = "";
        if(typeof syncTransactionDate==="function"){

            syncTransactionDate();

        }

    editingTransactionId = null;

}
/* =====================================================
        Transaction Count
===================================================== */

function getTransactionCount(){

    return transactions.length;

}
/* =====================================================
        Total Amount
===================================================== */

function getTotalAmount(type){

    return transactions

    .filter(t=>t.type===type)

    .reduce(

        (total,t)=>

        total + Number(t.amount),

        0

    );

}
/* =====================================================
        Monthly Helpers
===================================================== */

function getTransactionsByMonth(month){

    return transactions.filter(t=>{

        if(!t.date) return false;

        return t.date.startsWith(month);

    });

}

function getCurrentMonthTransactions(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    return getTransactionsByMonth(month);

}
/* =====================================================
        Investment Helpers
===================================================== */

function getInvestments(){

    return transactions.filter(

        t=>t.type==="investment"

    );

}

function getInvestmentTotal(){

    return getInvestments()

    .reduce(

        (total,t)=>

        total+Number(t.amount),

        0

    );

}
/* =====================================================
        Income / Expense Helpers
===================================================== */

function getIncomeTransactions(){

    return transactions.filter(

        t=>t.type==="income"

    );

}

function getExpenseTransactions(){

    return transactions.filter(

        t=>t.type==="expense"

    );

}

/* =====================================================
        Auto Save Hook
===================================================== */

function afterTransactionChanged(){

    if(typeof saveStorage==="function"){

        saveStorage();

    }

    if(typeof fullRefresh==="function"){

        fullRefresh();

    }

}
/* =====================================================
        Initialize Transactions
===================================================== */

function initializeTransactions(){

    if(typeof loadStorage==="function"){

        loadStorage();

    }

    renderTransactions();

    if(typeof renderRecentTransactions==="function"){

        renderRecentTransactions();

    }

}
/* =====================================================
        Transaction Statistics
===================================================== */

function getTransactionStatistics(){

    const month =

    document.getElementById("monthFilter")?.value || "";

    const list =

    getTransactionsByMonth(month);

    return{

        total:list.length,

        income:list
        .filter(t=>t.type==="income")
        .reduce((a,b)=>a+Number(b.amount),0),

        expense:list
        .filter(t=>t.type==="expense")
        .reduce((a,b)=>a+Number(b.amount),0),

        investment:list
        .filter(t=>t.type==="investment")
        .reduce((a,b)=>a+Number(b.amount),0)

    };

}
/* =====================================================
        Recent Transactions
===================================================== */

function getRecentTransactions(limit=5){

    return [...transactions]

    .sort(

        (a,b)=>

        new Date(b.date)-new Date(a.date)

    )

    .slice(0,limit);

}
/* =====================================================
        Refresh UI
===================================================== */

function refreshTransactionUI(){

    renderTransactions();

    if(typeof renderRecentTransactions==="function"){

        renderRecentTransactions();

    }

}

/* =====================================================
        Start Module
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    initializeTransactions();

}

);

let selectedTransactionId=null;

function openTransactionActions(id){

selectedTransactionId=id;

const sheet=document.getElementById("transactionActionSheet");

sheet.classList.add("show");

}

function closeTransactionActions(){

document
.getElementById(
"transactionActionSheet"
)
.classList.remove(
"show"
);

selectedTransactionId=null;

}

function editSelectedTransaction(){

if(selectedTransactionId){

editTransaction(selectedTransactionId);

}

closeTransactionActions();

}

function deleteSelectedTransaction(){

if(selectedTransactionId){

deleteTransaction(selectedTransactionId);

}

closeTransactionActions();

}

document.addEventListener(

"click",

function(e){

const sheet = document.getElementById(

"transactionActionSheet"

);

const actionSheet = document.querySelector(

".actionSheet"

);

if(

sheet.classList.contains("show") &&

!actionSheet.contains(e.target) &&

!e.target.closest(".menuButton")

){

closeTransactionActions();

}

});

const swipeState={

openCard:null,

startX:0,

startY:0,

card:null,

dragging:false,

translateX:0

};

function initializeSwipeCards(){

document

.querySelectorAll(

".transactionItem"

)

.forEach(card=>{

card.addEventListener(

"touchstart",

handleSwipeStart,

{passive:true}

);

card.addEventListener(

"touchmove",

handleSwipeMove,

{passive:false}

);

card.addEventListener(

"touchend",

handleSwipeEnd

);

});

}

function handleSwipeStart(e){

swipeState.card=e.currentTarget;

swipeState.startX=e.touches[0].clientX;

swipeState.startY=e.touches[0].clientY;

swipeState.dragging=false;

}

function handleSwipeMove(e){

if(!swipeState.card) return;

const dx=e.touches[0].clientX-swipeState.startX;

const dy=e.touches[0].clientY-swipeState.startY;

/* Ignore vertical scroll */

if(

Math.abs(dx)<Math.abs(dy)

){

return;

}

swipeState.dragging=true;

e.preventDefault();

/* Only swipe LEFT */

if(dx<0){

const move=Math.max(dx,-180);

swipeState.translateX=move;

swipeState.card.style.transform=

`translateX(${move}px)`;

}

}

function handleSwipeEnd(){

if(!swipeState.card){

return;

}

swipeState.card.style.transition=

"transform .22s ease";

/* Close previous */

if(

swipeState.openCard &&

swipeState.openCard!==swipeState.card

){

swipeState.openCard.style.transform=

"translateX(0px)";

}

/* Snap Open */

if(

swipeState.translateX<-80

){

swipeState.card.style.transform=

"translateX(-180px)";

swipeState.openCard=

swipeState.card;

}

/* Snap Close */

else{

swipeState.card.style.transform=

"translateX(0px)";

if(

swipeState.openCard===swipeState.card

){

swipeState.openCard=null;

}

}

setTimeout(function(){

if(swipeState.card){

swipeState.card.style.transition="";

}

},220);

swipeState.card=null;

swipeState.dragging=false;

swipeState.translateX=0;

}

document.addEventListener(

"click",

function(e){

if(

swipeState.openCard &&

!e.target.closest(".transactionRow")

){

swipeState.openCard.style.transform=

"translateX(0px)";

swipeState.openCard=null;

}

});


/* =====================================================
            CATEGORY DROPDOWN
===================================================== */

function refreshCategoryDropdown(){

    const type =

    document.getElementById("type");

    const category =

    document.getElementById("category");

    if(!type || !category){

        return;

    }

    const selectedType =

    type.value || "expense";

    const currentValue =

    category.value;

    category.innerHTML="";

    /* Add New */

    const addOption =

    document.createElement("option");

    addOption.value="__add__";

    addOption.textContent="➕ Add New Category";

    category.appendChild(addOption);

    /* Select Category */

    const selectOption =

    document.createElement("option");

    selectOption.value="";

    selectOption.textContent="Select Category";

    category.appendChild(selectOption);

    /* Categories */

    getAllCategories(selectedType)

    .forEach(function(item){

        const option =

        document.createElement("option");

        option.value=item;

        option.textContent=item;

        category.appendChild(option);

    });

    if(

        [...category.options]

        .some(o=>o.value===currentValue)

    ){

        category.value=currentValue;

    }

    else{

        category.value="";

    }

}


/* =====================================================
            ADD CUSTOM CATEGORY
===================================================== */

function handleCategorySelection(){

    const category =
    document.getElementById("category");

    if(category.value === "__add__"){

        openCategoryPopup();

    }

}


function openCategoryPopup(){

    document
    .getElementById("categoryPopup")
    .classList.add("show");

    const input =
    document.getElementById("newCategoryInput");

    input.value="";

    setTimeout(()=>input.focus(),100);

}

function closeCategoryPopup(){

    document
    .getElementById("categoryPopup")
    .classList.remove("show");

    refreshCategoryDropdown();

    document
    .getElementById("category").value = "";

    document
    .getElementById("newCategoryInput").value = "";

}

function saveNewCategory(){

    const input =
    document.getElementById("newCategoryInput");

    const type =
    document.getElementById("type");

    const category =
    document.getElementById("category");

    const newCategory =
    input.value.trim();

    if(newCategory===""){

        showToast("Enter category name");

        return;

    }

    const exists =
    getAllCategories(type.value)
    .some(c=>c.toLowerCase()===newCategory.toLowerCase());

    if(exists){

        showToast("Category already exists");

        return;

    }

    saveCustomCategory(
        type.value,
        newCategory
    );

    refreshCategoryDropdown();

    category.value=newCategory;

    closeCategoryPopup();

}

/* =====================================================
            TYPE CHANGE
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    const type =
    document.getElementById("type");

    if(type){

        type.addEventListener(
            "change",
            refreshCategoryDropdown
        );

    }

    const category =
    document.getElementById("category");

    if(category){

        category.addEventListener(
            "change",
            handleCategorySelection
        );

    }

    document
    .getElementById("cancelCategoryBtn")
    .addEventListener(
        "click",
        closeCategoryPopup
    );

    document
    .getElementById("saveCategoryBtn")
    .addEventListener(
        "click",
        saveNewCategory
    );

    document
    .getElementById("newCategoryInput")
    .addEventListener(
        "keydown",
        function(e){

            if(e.key==="Enter"){

                saveNewCategory();

            }

        }
    );

    refreshCategoryDropdown();

});
