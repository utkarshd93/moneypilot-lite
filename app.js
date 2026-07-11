/* ===========================================
        MoneyPilot Navigation
=========================================== */

const homeTab = document.getElementById("homeTab");
const transactionTab = document.getElementById("transactionTab");
const settingsTab = document.getElementById("settingsTab");

const homeScreen = document.getElementById("homeScreen");
const transactionScreen = document.getElementById("transactionScreen");

function openHome() {

    homeScreen.style.display = "block";
    transactionScreen.style.display = "none";

    homeTab.classList.add("active");
    transactionTab.classList.remove("active");

}

function openTransactions() {

    homeScreen.style.display = "none";
    transactionScreen.style.display = "block";

    transactionTab.classList.add("active");
    homeTab.classList.remove("active");

}

if(homeTab){

    homeTab.addEventListener("click", openHome);

}

if(transactionTab){

    transactionTab.addEventListener("click", openTransactions);

}

// App opens on Home
openHome();
