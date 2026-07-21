/* =====================================================
            Net Worth
===================================================== */

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

    const totalLiabilities = 0;

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

const ASSET_CATEGORY_KEY = "MP_ASSET_CATEGORIES";

const ASSET_KEY = "MP_ASSETS";

const assetActionSheet =
document.getElementById("assetActionSheet");

const editAssetBtn =
document.getElementById("editAssetBtn");

const deleteAssetBtn =
document.getElementById("deleteAssetBtn");

const cancelAssetActionBtn =
document.getElementById("cancelAssetActionBtn");

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

addAssetBtn.onclick = function(){

    netWorthSheet.classList.remove("show");

    assetAmount.value = "";

    assetDescription.value = "";

    loadAssetCategories();

    assetSheet.classList.add("show");

};

function closeAssetForm(){

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

    assets.push({

        id: crypto.randomUUID(),

        category,

        amount,

        description,

        createdAt: Date.now(),

        updatedAt: Date.now()

    });

    saveAssets(assets);

    assetCategory.selectedIndex = 0;

    assetAmount.value = "";

    assetDescription.value = "";

    assetSheet.classList.remove("show");

    loadNetWorthSummary();

    renderAssets();

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

                    <h4>${asset.category}</h4>

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

editAssetBtn.onclick=function(){

    assetActionSheet.classList.remove("show");

    alert("Edit Asset will be implemented next.");

};
