/* =====================================
   MoneyPilot Bills
===================================== */

const BILL_STORAGE = "moneypilot_bills";

let bills = [];

loadBills();

/* =====================================
   Load
===================================== */

function loadBills(){

    const data = localStorage.getItem(BILL_STORAGE);

    if(data){

        bills = JSON.parse(data);

    }

    renderBills();

}


/* =====================================
   Save
===================================== */

function saveBills(){

    localStorage.setItem(

        BILL_STORAGE,

        JSON.stringify(bills)

    );

}


/* =====================================
   Add Button
===================================== */

document
.getElementById("addBillBtn")
.onclick = function(){

    const form =
    document.getElementById("billForm");

    form.style.display =
    form.style.display=="block"

    ?

    "none"

    :

    "block";

};


/* =====================================
   Save Bill
===================================== */

document
.getElementById("saveBillBtn")
.onclick = function(){

    const name =
    document.getElementById("billName").value;

    const amount =
    Number(

    document.getElementById("billAmount").value

    );

    const due =
    document.getElementById("billDueDate").value;

    if(name=="" || amount<=0){

        alert("Enter Bill Details");

        return;

    }

    bills.push({

        id:Date.now(),

        name,

        amount,

        due,

        paid:false

    });

    saveBills();

    renderBills();

    document.getElementById("billName").value="";
    document.getElementById("billAmount").value="";
    document.getElementById("billDueDate").value="";

    document.getElementById("billForm").style.display="none";

};


/* =====================================
   Render
===================================== */

function renderBills(){

    const container =
    document.getElementById("billsContainer");

    container.innerHTML="";

    let paid=0;
    let pending=0;

    bills.forEach(bill=>{

        if(bill.paid){

            paid+=bill.amount;

        }

        else{

            pending+=bill.amount;

        }

        container.innerHTML+=`

<div class="billItem">

<div class="billLeft">

<h3>

${bill.name}

</h3>

<p>

Due :

${bill.due}

</p>

</div>

<div class="billRight">

<div class="billAmount">

₹${bill.amount.toLocaleString()}

</div>

<button

onclick="toggleBill(${bill.id})">

${bill.paid?"✅ Paid":"Pay"}

</button>

<button

onclick="deleteBill(${bill.id})">

❌

</button>

</div>

</div>

`;

    });

    document.getElementById("billCount").innerHTML =
    bills.length;

    document.getElementById("paidBills").innerHTML =
    "₹"+paid.toLocaleString();

    document.getElementById("pendingBills").innerHTML =
    "₹"+pending.toLocaleString();

}


/* =====================================
   Toggle
===================================== */

function toggleBill(id){

    const bill =
    bills.find(x=>x.id==id);

    if(!bill) return;

    bill.paid=!bill.paid;

    saveBills();

    renderBills();

}


/* =====================================
   Delete
===================================== */

function deleteBill(id){

    bills = bills.filter(

        x=>x.id!=id

    );

    saveBills();

    renderBills();

}


/* =====================================
   Clear Bills
===================================== */

const clearBtn =
document.getElementById("clearBillsBtn");

if(clearBtn){

clearBtn.onclick=function(){

if(confirm("Delete All Bills?")){

bills=[];

saveBills();

renderBills();

}

};

}
