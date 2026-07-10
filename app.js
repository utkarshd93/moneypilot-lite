/* =====================================
   MoneyPilot Lite
   app.js
===================================== */

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    setTodayDate();

    setGreeting();

    bindEvents();

    if (typeof loadStorage === "function") {
        loadStorage();
    }

    if (typeof renderTransactions === "function") {
        renderTransactions();
    }

    if (typeof renderBills === "function") {
        renderBills();
    }

}

function bindEvents() {

    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const resetBtn = document.getElementById("resetBtn");
    const backupFile = document.getElementById("backupFile");

    if(exportBtn){

        exportBtn.onclick = exportBackup;

    }

    if(importBtn){

        importBtn.onclick = function(){

            backupFile.click();

        };

    }

    if(backupFile){

        backupFile.onchange = function(e){

            if(e.target.files.length){

                importBackup(e.target.files[0]);

            }

        };

    }

    if(resetBtn){

        resetBtn.onclick = resetAllData;

    }

}

function setTodayDate(){

    const input = document.getElementById("date");

    if(!input) return;

    if(!input.value){

        input.valueAsDate = new Date();

    }

}

function setGreeting(){

    const greeting = document.getElementById("greeting");

    if(!greeting) return;

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.innerHTML = "Good Morning ☀️";

    }

    else if(hour < 17){

        greeting.innerHTML = "Good Afternoon 🌤";

    }

    else{

        greeting.innerHTML = "Good Evening 🌙";

    }

}

function showToast(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}
