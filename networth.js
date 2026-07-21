/* =====================================================
            Net Worth
===================================================== */

let editingAssetId = null;

let isEditMode = false;

let isLiabilityMode = false;

function loadNetWorthSummary() {

    const cashBalance = document.getElementById("cashBalance");
    const investment = document.getElementById("investmentTotal");

    const cashBalanceWorth = document.getElementById("cashBalanceWorth");
    const investmentWorth = document.getElementById("investmentWorth");

    const assetTotal = document.getElementById("assetTotal");
    const liabilityTotal = document.getElementById("liabilityTotal");
    const totalWorthValue = document.getElementById("totalWorthValue");

    // Copy values from Dashboard

    if (cashBalance && cashBalanceWorth) {

        cashBalanceWorth.textContent = cashBalance.textContent;

    }

    if (investment && investmentWorth) {

        investmentWorth.textContent = investment.textContent;

    }

    // Calculate Assets

    const assets = getAssets();

    const totalAssets = assets.reduce((sum, asset) => {

        return sum + Number(asset.amount);

    }, 0);

    assetTotal.textContent = formatCurrency(totalAssets);

    // Liabilities (will be implemented next)

    let totalLiabilities = 0;

if (typeof getLiabilities === "function") {

    const liabilities = getLiabilities();

    totalLiabilities = liabilities.reduce(

        (sum, item) => sum + Number(item.amount),

        0

    );

}

    liabilityTotal.textContent = formatCurrency(totalLiabilities);

    // Total Net Worth

    const cash = cashBalance
        ? Number(cashBalance.textContent.replace(/[₹,]/g, ""))
        : 0;

    totalWorthValue.textContent = formatCurrency(

        cash +
        totalAssets -
        totalLiabilities

    );

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


/* ==========================================
        Asset Sheet Elements
========================================== */

const assetSheet = document.getElementById("assetSheet");

const addAssetBtn = document.getElementById("addAssetBtn");

const closeAssetSheet = document.getElementById("closeAssetSheet");

const cancelAssetBtn = document.getElementById("cancelAssetBtn");

const assetCategory = document.getElementById("assetCategory");

const assetAmount = document.getElementById("assetAmount");

const assetDescription = document.getElementById("assetDescription");

const assetCategoryPopup = document.getElementById("assetCategoryPopup");

const newAssetCategoryInput = document.getElementById("newAssetCategoryInput");

const saveAssetCategoryBtn = document.getElementById("saveAssetCategoryBtn");

const cancelAssetCategoryBtn = document.getElementById("cancelAssetCategoryBtn");

const saveAssetBtn = document.getElementById("saveAssetBtn");

const ASSET_CATEGORY_KEY = "MP_ASSET_CATEGORIES";

const ASSET_KEY = "MP_ASSETS";

const LIABILITY_KEY = "MP_LIABILITIES";

const addLiabilityBtn =
document.getElementById("addLiabilityBtn");

const assetActionSheet =
document.getElementById("assetActionSheet");

const editAssetBtn =
document.getElementById("editAssetBtn");

const deleteAssetBtn =
document.getElementById("deleteAssetBtn");

const cancelAssetActionBtn =
document.getElementById("cancelAssetActionBtn");

const assetSummaryCard =
document.getElementById("assetSummaryCard");

const assetListContainer =
document.getElementById("assetListContainer");

const assetExpandIcon =
document.getElementById("assetExpandIcon");

const liabilitySummaryCard =
document.getElementById("liabilitySummaryCard");

const liabilityListContainer =
document.getElementById("liabilityListContainer");

const liabilityExpandIcon =
document.getElementById("liabilityExpandIcon");

let liabilitiesExpanded = false;

let assetsExpanded = false;

let selectedAssetId = null;

const DEFAULT_ASSET_CATEGORIES = [

"Land",
"House",
"Flat",
"Plot",
"Mutual Fund",
"Stocks",
"Gold",
"Silver",
"FD",
"Savings Account",
"Current Account",
"Cash",
"Business",
"Vehicle",
"Other"

];

function getAssetCategories(){

    const saved = localStorage.getItem(ASSET_CATEGORY_KEY);

    if(saved){

        return JSON.parse(saved);

    }

    return DEFAULT_ASSET_CATEGORIES;

}

function saveAssetCategories(categories){

    localStorage.setItem(

        ASSET_CATEGORY_KEY,

        JSON.stringify(categories)

    );

}

function loadAssetCategories(selected = ""){

    assetCategory.innerHTML = "";

    assetCategory.add(

        new Option("Select Category","")

    );

    assetCategory.add(

        new Option("➕ Add New Category","__new__")

    );

    getAssetCategories().forEach(category=>{

        assetCategory.add(

            new Option(category,category)

        );

    });

    assetCategory.value = selected;

}

addAssetBtn.onclick = function () {

    isLiabilityMode = false;

    netWorthSheet.classList.remove("show");

    document.getElementById("assetSheetTitle").textContent = "Add Asset";

    saveAssetBtn.textContent = "Save Asset";

    loadAssetCategories();

    resetAssetForm();

    assetSheet.classList.add("show");

};

addLiabilityBtn.onclick = function () {

    isLiabilityMode = true;

    netWorthSheet.classList.remove("show");

    document.getElementById("assetSheetTitle").textContent = "Add Liability";

    saveAssetBtn.textContent = "Save Liability";

    // Temporary categories until we build liability categories

    assetCategory.innerHTML = "";

    assetCategory.add(new Option("Select Category",""));

    assetCategory.add(new Option("Home Loan","Home Loan"));
    assetCategory.add(new Option("Car Loan","Car Loan"));
    assetCategory.add(new Option("Personal Loan","Personal Loan"));
    assetCategory.add(new Option("Business Loan","Business Loan"));
    assetCategory.add(new Option("Credit Card","Credit Card"));
    assetCategory.add(new Option("Other","Other"));

    assetAmount.value = "";

    assetDescription.value = "";

    assetSheet.classList.add("show");

};

function closeAssetForm() {

    resetAssetForm();

    assetSheet.classList.remove("show");

}

closeAssetSheet.onclick = closeAssetForm;

cancelAssetBtn.onclick = closeAssetForm;

assetCategory.addEventListener(

"change",

function(){

    if(this.value==="__new__"){

        newAssetCategoryInput.value="";

        assetCategoryPopup.classList.add("show");

    }

});

cancelAssetCategoryBtn.onclick=function(){

    assetCategoryPopup.classList.remove("show");

    loadAssetCategories();

};

saveAssetCategoryBtn.onclick=function(){

    const category =

    newAssetCategoryInput.value.trim();

    if(category===""){

        alert("Please enter category.");

        return;

    }

    const categories = getAssetCategories();

    const exists = categories.some(

        item =>

        item.toLowerCase()===category.toLowerCase()

    );

    if(!exists){

        categories.push(category);

        saveAssetCategories(categories);

    }

    assetCategoryPopup.classList.remove("show");

    loadAssetCategories(category);

};

function getAssets() {

    const saved = localStorage.getItem(ASSET_KEY);

    return saved ? JSON.parse(saved) : [];

}

function saveAssets(assets) {

    localStorage.setItem(
        ASSET_KEY,
        JSON.stringify(assets)
    );

}

saveAssetBtn.onclick = function () {

    const category = assetCategory.value.trim();

    const amount = Number(assetAmount.value);

    const description = assetDescription.value.trim();

    // Validation

    if (!category) {

        alert("Please select an Asset Category.");

        assetCategory.focus();

        return;

    }

    if (category === "__new__") {

        alert("Please add a category first.");

        assetCategory.focus();

        return;

    }

    if (assetAmount.value.trim() === "") {

        alert("Please enter the Asset Amount.");

        assetAmount.focus();

        return;

    }

    if (isNaN(amount) || amount <= 0) {

        alert("Amount should be greater than ₹0.");

        assetAmount.focus();

        return;

    }

    const assets = getAssets();

if (isLiabilityMode) {

    const liabilities = JSON.parse(
        localStorage.getItem(LIABILITY_KEY) || "[]"
    );

    liabilities.push({

        id: crypto.randomUUID(),
        category,
        amount,
        description,
        createdAt: Date.now(),
        updatedAt: Date.now()

    });

    localStorage.setItem(
        LIABILITY_KEY,
        JSON.stringify(liabilities)
    );

}
else if (isEditMode) {

    const asset = assets.find(
        item => item.id === editingAssetId
    );

    if(asset){

        asset.category = category;
        asset.amount = amount;
        asset.description = description;
        asset.updatedAt = Date.now();

    }

}
else {

    assets.push({

        id: crypto.randomUUID(),
        category,
        amount,
        description,
        createdAt: Date.now(),
        updatedAt: Date.now()

    });

}

    if (!isLiabilityMode) {

    saveAssets(assets);

}

// Reset form
resetAssetForm();

assetSheet.classList.remove("show");

loadNetWorthSummary();

renderAssets();

if (typeof renderLiabilities === "function") {

    renderLiabilities();

}

};

function formatCurrency(amount) {

    return "₹" + Number(amount).toLocaleString("en-IN");

}

function renderAssets() {

    const assetList = document.getElementById("assetList");

    if (!assetList) return;

    const assets = getAssets();

    if (assets.length === 0) {

        assetList.innerHTML = `

            <div class="emptyState">

                <div class="emptyIcon">🏦</div>

                <p>No Assets Yet</p>

                <span>Add your first asset.</span>

            </div>

        `;

        return;

    }

    assetList.innerHTML = "";

    assets.forEach(asset => {

        assetList.innerHTML += `

            <div class="assetCard" data-id="${asset.id}">

                <div class="assetInfo">

                    <h4>${getAssetIcon(asset.category)} ${asset.category}</h4>

                    <p>${asset.description || "No Description"}</p>

                </div>

                <div class="assetRight">

                    <h3>${formatCurrency(asset.amount)}</h3>

                    <button
                        class="assetMenuBtn"
                        data-id="${asset.id}">

                        ⋮

                    </button>

                </div>

            </div>

        `;

    });

document.querySelectorAll(".assetMenuBtn").forEach(button=>{

    button.onclick=function(){

        selectedAssetId=this.dataset.id;

        assetActionSheet.classList.add("show");

    };

});

}


function renderLiabilities() {

    const liabilityList =
    document.getElementById("liabilityList");

    if(!liabilityList) return;

    const liabilities = getLiabilities();

    if(liabilities.length===0){

        liabilityList.innerHTML=`

            <div class="emptyState">

                <div class="emptyIcon">💳</div>

                <p>No Liabilities Yet</p>

                <span>Add your first liability.</span>

            </div>

        `;

        return;

    }

    liabilityList.innerHTML="";

    liabilities.forEach(liability=>{

        liabilityList.innerHTML += `

        <div class="assetCard">

            <div class="assetInfo">

                <h4>${getLiabilityIcon(liability.category)} ${liability.category}</h4>

                <p>${liability.description || "No Description"}</p>

            </div>

            <div class="assetRight">

                <h3>${formatCurrency(liability.amount)}</h3>

            </div>

        </div>

        `;

    });

}


cancelAssetActionBtn.onclick=function(){

    assetActionSheet.classList.remove("show");

    selectedAssetId=null;

};

deleteAssetBtn.onclick=function(){

    if(!selectedAssetId) return;

    const assets=getAssets().filter(

        asset=>asset.id!==selectedAssetId

    );

    saveAssets(assets);

    assetActionSheet.classList.remove("show");

    selectedAssetId=null;

    renderAssets();

    loadNetWorthSummary();

};

editAssetBtn.onclick = function () {

    const asset = getAssets().find(

        item => item.id === selectedAssetId

    );

    if (!asset) return;

    editingAssetId = asset.id;

    isEditMode = true;

    document.getElementById("assetSheetTitle").textContent =

        "Edit Asset";

    saveAssetBtn.textContent =

        "Update Asset";

    loadAssetCategories(asset.category);

    assetAmount.value = asset.amount;

    assetDescription.value = asset.description;

    assetActionSheet.classList.remove("show");

    assetSheet.classList.add("show");

};

function resetAssetForm(){

    editingAssetId = null;

    isEditMode = false;

    document.getElementById("assetSheetTitle").textContent = "Add Asset";

    saveAssetBtn.textContent = "Save Asset";

    assetCategory.selectedIndex = 0;

    assetAmount.value = "";

    assetDescription.value = "";

    isLiabilityMode = false;

}

assetSummaryCard.onclick = function () {

    assetsExpanded = !assetsExpanded;

    if (assetsExpanded) {

        renderAssets();   // <-- ADD THIS

        assetListContainer.classList.add("expanded");

        assetExpandIcon.textContent = "▲";

    } else {

        assetListContainer.classList.remove("expanded");

        assetExpandIcon.textContent = "▼";

    }

};

function getAssetIcon(category){

    switch(category){

        case "House": return "🏠";

        case "Flat": return "🏢";

        case "Land": return "🌾";

        case "Plot": return "📍";

        case "Warehouse": return "🏭";

        case "Vehicle": return "🚗";

        case "Gold": return "🥇";

        case "Silver": return "🩶";

        case "Mutual Fund": return "📈";

        case "Stocks": return "💹";

        case "FD": return "🏦";

        case "Cash": return "💵";

        case "Business": return "💼";

        default: return "📦";

    }

}

function getLiabilityIcon(category){

    switch(category){

        case "Home Loan":
            return "🏠";

        case "Car Loan":
            return "🚗";

        case "Personal Loan":
            return "💰";

        case "Business Loan":
            return "🏢";

        case "Credit Card":
            return "💳";

        default:
            return "📄";

    }

}

liabilitySummaryCard.onclick=function(){

    liabilitiesExpanded=!liabilitiesExpanded;

    if(liabilitiesExpanded){

        renderLiabilities();

        liabilityListContainer.classList.add("expanded");

        liabilityExpandIcon.textContent="▲";

    }
    else{

        liabilityListContainer.classList.remove("expanded");

        liabilityExpandIcon.textContent="▼";

    }

};


function getLiabilities(){

    const saved = localStorage.getItem(LIABILITY_KEY);

    return saved ? JSON.parse(saved) : [];

}
