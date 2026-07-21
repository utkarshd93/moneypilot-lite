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


