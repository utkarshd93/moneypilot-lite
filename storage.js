/* ===========================================
   MoneyPilot Lite
   Storage Manager
=========================================== */

const TRANSACTION_KEY = "moneypilot_transactions";
const BILL_KEY = "moneypilot_bills";

/* ===========================================
   Load Transactions
=========================================== */

function loadStorage(){

    try{

        const data = localStorage.getItem(TRANSACTION_KEY);

        transactions = data ? JSON.parse(data) : [];

    }

    catch(e){

        transactions=[];

    }

}


/* ===========================================
   Save Transactions
=========================================== */

function saveStorage(){

    localStorage.setItem(

        TRANSACTION_KEY,

        JSON.stringify(transactions)

    );

}


/* ===========================================
   Export Backup
=========================================== */

function exportBackup(){

    const backup={

        version:"1.2",

        exportedAt:new Date().toISOString(),

        transactions:transactions,

        bills:bills

    };

    const blob=new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="MoneyPilot_Backup.json";

    a.click();

}


/* ===========================================
   Import Backup
=========================================== */

function importBackup(file){

    const reader=new FileReader();

    reader.onload=function(e){

        try{

            const backup=

            JSON.parse(

                e.target.result

            );

            transactions=

            backup.transactions || [];

            bills=

            backup.bills || [];

            saveStorage();

            saveBills();

            renderTransactions();

            renderBills();

            alert("Backup Imported");

        }

        catch(err){

            alert("Invalid Backup");

        }

    };

    reader.readAsText(file);

}


/* ===========================================
   Reset App
=========================================== */

function resetAllData(){

    if(

        !confirm(

        "Delete all data?"

        )

    )

    return;

    transactions=[];

    bills=[];

    saveStorage();

    saveBills();

    renderTransactions();

    renderBills();

}


/* ===========================================
   Auto Load
=========================================== */

loadStorage();
