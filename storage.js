/* =====================================================
        MoneyPilot Lite V3
        Storage Manager
===================================================== */

const TRANSACTION_KEY = "moneypilot_transactions_v3";

const SETTINGS_KEY = "moneypilot_settings_v3";

let settings = {};
/* =====================================================
        Load Transactions
===================================================== */

function loadStorage(){

    try{

        const data =

        localStorage.getItem(

            TRANSACTION_KEY

        );

        transactions =

        data ?

        JSON.parse(data)

        :

        [];

    }

    catch(e){

        console.error(e);

        transactions=[];

    }

}
/* =====================================================
        Save Transactions
===================================================== */

function saveStorage(){

    localStorage.setItem(

        TRANSACTION_KEY,

        JSON.stringify(

            transactions

        )

    );

}
/* =====================================================
        Settings
===================================================== */

function loadSettings(){

    try{

        const data =

        localStorage.getItem(

            SETTINGS_KEY

        );

        settings =

        data ?

        JSON.parse(data)

        :

        {};

    }

    catch(e){

        settings={};

    }

}
function saveSettings(){

    localStorage.setItem(

        SETTINGS_KEY,

        JSON.stringify(

            settings

        )

    );

}
/* =====================================================
        Backup
===================================================== */

function exportBackup(){

    const backup={

        version:"3.0",

        exportedAt:

        new Date()

        .toISOString(),

        transactions,

        settings

    };

    const blob =

    new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type:

            "application/json"

        }

    );

    const url =

    URL.createObjectURL(blob);

    const a =

    document.createElement("a");

    a.href = url;

    a.download =

    "MoneyPilot_Backup.json";

    a.click();

    URL.revokeObjectURL(url);

}
/* =====================================================
        Import Backup
===================================================== */

function importBackup(file){

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const backup = JSON.parse(

                e.target.result

            );

            transactions =

            backup.transactions || [];

            settings =

            backup.settings || {};

            saveStorage();

            saveSettings();

            if(typeof fullRefresh==="function"){

                fullRefresh();

            }

            if(typeof showToast==="function"){

                showToast("Backup Imported");

            }

        }

        catch(err){

            console.error(err);

            alert("Invalid Backup File");

        }

    };

    reader.readAsText(file);

}
/* =====================================================
        Reset Application
===================================================== */

function resetApplication(){

    if(

        !confirm(

            "Delete all MoneyPilot data?"

        )

    ){

        return;

    }

    transactions=[];

    settings={};

    saveStorage();

    saveSettings();

    if(typeof fullRefresh==="function"){

        fullRefresh();

    }

    if(typeof showToast==="function"){

        showToast("Data Reset");

    }

}
/* =====================================================
        Backup Events
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    const exportBtn =

    document.getElementById("exportBtn");

    const importBtn =

    document.getElementById("importBtn");

    const resetBtn =

    document.getElementById("resetBtn");

    const backupFile =

    document.getElementById("backupFile");

    if(exportBtn){

        exportBtn.onclick = exportBackup;

    }

    if(importBtn){

        importBtn.onclick=function(){

            backupFile.click();

        };

    }

    if(backupFile){

        backupFile.onchange=function(){

            if(this.files.length){

                importBackup(

                    this.files[0]

                );

            }

        };

    }

    if(resetBtn){

        resetBtn.onclick=

        resetApplication;

    }

});
/* =====================================================
        Initialize Storage
===================================================== */

function initializeStorage(){

    loadStorage();

    loadSettings();

}
document.addEventListener(

"DOMContentLoaded",

function(){

    initializeStorage();

}
);
