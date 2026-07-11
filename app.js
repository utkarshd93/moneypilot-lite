/* ===========================================
        MoneyPilot Navigation
=========================================== */

const homeTab =
document.getElementById("homeTab");

const transactionTab =
document.getElementById("transactionTab");

const homeScreen =
document.getElementById("homeScreen");

const transactionScreen =
document.getElementById("transactionScreen");

if(homeTab){

homeTab.onclick=function(){

homeScreen.style.display="block";

transactionScreen.style.display="none";

homeTab.classList.add("active");

transactionTab.classList.remove("active");

};

}

if(transactionTab){

transactionTab.onclick=function(){

homeScreen.style.display="none";

transactionScreen.style.display="block";

transactionTab.classList.add("active");

homeTab.classList.remove("active");

};

}
