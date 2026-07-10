/* ===================================
      Bills Manager
=================================== */

let bills = JSON.parse(

localStorage.getItem("moneypilot_bills")

) || [];


/* -----------------------------
    Show / Hide Form
------------------------------ */

document

.getElementById("addBillBtn")

.addEventListener("click",()=>{

const form=document.getElementById("billForm");

form.style.display=

form.style.display==="none"

?

"block"

:

"none";

});


/* -----------------------------
      Save Bill
------------------------------ */

document

.getElementById("saveBillBtn")

.addEventListener("click",saveBill);


function saveBill(){

const name=

billName.value.trim();

const amount=

Number(billAmount.value);

const due=

Number(billDueDate.value);


if(name==""||amount<=0){

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

billName.value="";

billAmount.value="";

billDueDate.value="";

billForm.style.display="none";

}


/* -----------------------------
      Save
------------------------------ */

function saveBills(){

localStorage.setItem(

"moneypilot_bills",

JSON.stringify(bills)

);

}
/* -----------------------------
      Render Bills
------------------------------ */

function renderBills(){

const container=

document.getElementById(

"billsContainer"

);

container.innerHTML="";


bills.forEach((bill,index)=>{

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

₹${bill.amount}

</div>

<button

onclick="toggleBill(${index})">

${bill.paid

?

"✅ Paid"

:

"Pay"}

</button>

</div>

</div>

`;

});

}


/* -----------------------------
      Toggle Paid
------------------------------ */

function toggleBill(index){

bills[index].paid=

!bills[index].paid;

saveBills();

renderBills();

}


/* -----------------------------
      Delete
------------------------------ */

function deleteBill(index){

bills.splice(index,1);

saveBills();

renderBills();

}


/* -----------------------------
      Load
------------------------------ */

renderBills();
