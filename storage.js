/* ==========================================
   MoneyPilot Storage
========================================== */

const STORAGE_KEY = "moneypilot_transactions";

/* ==========================================
   Save
========================================== */

function saveStorage(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(transactions)

    );

}

/* ==========================================
   Load
========================================== */

function loadStorage(){

    const data =

    localStorage.getItem(STORAGE_KEY);

    if(!data){

        transactions=[];

        return;

    }

    try{

        transactions=

        JSON.parse(data);

    }

    catch(e){

        transactions=[];

    }

}

/* ==========================================
   Reset
========================================== */

function resetAllData(){

    const ok=

    confirm(

    "Delete all transactions?"

    );

    if(!ok)

        return;

    transactions=[];

    saveStorage();

    renderTransactions();

}

/* ==========================================
   Export JSON
========================================== */

function exportBackup(){

    const json=

    JSON.stringify(

        transactions,

        null,

        2

    );

    const blob=

    new Blob(

        [json],

        {

            type:

            "application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download=

    "MoneyPilot_Backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================
   Import JSON
========================================== */

function importBackup(file){

    const reader=

    new FileReader();

    reader.onload=

    function(e){

        try{

            transactions=

            JSON.parse(

                e.target.result

            );

            saveStorage();

            renderTransactions();

            alert(

            "Backup Imported"

            );

        }

        catch(err){

            alert(

            "Invalid Backup"

            );

        }

    };

    reader.readAsText(file);

}

/* ==========================================
   Auto Load
========================================== */

loadStorage();
