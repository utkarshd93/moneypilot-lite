/* ==========================================
   MoneyPilot Bills Engine
========================================== */

let bills = [];

const BILL_KEY = "moneypilot_bills";

/* ==========================================
   Load Bills
========================================== */

function loadBills(){

    const data = localStorage.getItem(BILL_KEY);

    if(data){

        try{

            bills = JSON.parse(data);

        }

        catch(e){

            bills=[];

        }

    }

}

/* ==========================================
   Save Bills
========================================== */

function saveBills(){

    localStorage.setItem(

        BILL_KEY,

        JSON.stringify(bills)

    );

}

/* ==========================================
   Add Bill Button
========================================== */

const addBillBtn = document.getElementById("addBillBtn");

if (addBillBtn) {

    addBillBtn.addEventListener("click", function () {

        const form = document.getElementById("billForm");

        if (form.style.display === "none" || form.style.display === "") {

            form.style.display = "block";

            addBillBtn.innerHTML = "✖ Close";

        } else {

            form.style.display = "none";

            addBillBtn.innerHTML = "+ Add Bill";

        }

    });

}


/* ==========================================
   Save Bill
========================================== */

document

.getElementById("saveBillBtn")

.addEventListener(

"click",

saveBill

);

function saveBill(){

const name=

document.getElementById(

"billName"

).value.trim();

const amount=

Number(

document.getElementById(

"billAmount"

).value

);

const due=

Number(

document.getElementById(

"billDueDate"

).value

);

if(name==""||amount<=0){

alert("Enter Bill Details");

return;

}

bills.push({

id:Date.now(),

name,

amount,

due,

paid:false,

createdAt:new Date().toISOString()

});

saveBills();

renderBills();

clearBillForm();
   
   document.getElementById("billForm").style.display = "none";
    document.getElementById("addBillBtn").innerHTML = "+ Add Bill";

showToast("Bill Added");

}
/* ==========================================
   Render Bills
========================================== */

function renderBills(){

    const container =
    document.getElementById("billsContainer");

    if(!container) return;

    container.innerHTML="";

    let paidAmount=0;
    let pendingAmount=0;

    if(bills.length===0){

        container.innerHTML=

        `<p style="text-align:center;opacity:.7;">
            No Bills Added
        </p>`;

    }

    bills.forEach(bill=>{

        if(bill.paid){

            paidAmount+=Number(bill.amount);

        }else{

            pendingAmount+=Number(bill.amount);

        }

        container.innerHTML+=`

<div class="billItem">

    <div class="billLeft">

        <h3>

            ${bill.name}

        </h3>

        <p>

            Due : ${bill.due}

        </p>

    </div>

    <div class="billRight">

        <div class="billAmount">

            ₹${Number(bill.amount).toLocaleString()}

        </div>

        <button
        onclick="toggleBill(${bill.id})">

        ${bill.paid ? "✅ Paid" : "💰 Pay"}

        </button>

        <button
        onclick="deleteBill(${bill.id})">

        🗑

        </button>

    </div>

</div>

`;

    });

    document.getElementById("billCount").innerHTML =
    bills.length;

    document.getElementById("paidBills").innerHTML =
    "₹"+paidAmount.toLocaleString();

    document.getElementById("pendingBills").innerHTML =
    "₹"+pendingAmount.toLocaleString();

}


/* ==========================================
   Toggle Paid
========================================== */

function toggleBill(id){

    const bill=

    bills.find(

        x=>x.id==id

    );

    if(!bill) return;

    bill.paid=!bill.paid;

    saveBills();

    renderBills();

    showToast(

        bill.paid

        ?

        "Bill Paid"

        :

        "Bill Pending"

    );

}


/* ==========================================
   Delete Bill
========================================== */

function deleteBill(id){

    if(

        !confirm(

        "Delete Bill?"

        )

    )

    return;

    bills=bills.filter(

        x=>x.id!=id

    );

    saveBills();

    renderBills();

}


/* ==========================================
   Clear Bills
========================================== */

const clearBillsBtn=
document.getElementById(

"clearBillsBtn"

);

if(clearBillsBtn){

clearBillsBtn.addEventListener(

"click",

()=>{

if(

confirm(

"Delete All Bills?"

)

){

bills=[];

saveBills();

renderBills();

showToast(

"All Bills Deleted"

);

}

}

);

}


/* ==========================================
   Clear Form
========================================== */

function clearBillForm(){

document.getElementById(

"billName"

).value="";

document.getElementById(

"billAmount"

).value="";

document.getElementById(

"billDueDate"

).value="";

document.getElementById(

"billForm"

).style.display="none";

}


/* ==========================================
   Initial Load
========================================== */

loadBills();

renderBills();
