/* ===========================================
        MoneyPilot Authentication V2
=========================================== */

const AUTH = {

    PIN_KEY: "mp_pin_hash",

    SESSION_KEY: "mp_session",

    initialized: false

};
function $(id){

    return document.getElementById(id);

}
function hasPin(){

    return localStorage.getItem(

        AUTH.PIN_KEY

    ) !== null;

}
function isLoggedIn(){

    return sessionStorage.getItem(

        AUTH.SESSION_KEY

    ) === "true";

}
function loginSuccess(){

    sessionStorage.setItem(

        AUTH.SESSION_KEY,

        "true"

    );

    AUTH.initialized = true;

    hideLockScreen();

}
function logout(){

    sessionStorage.removeItem(

        AUTH.SESSION_KEY

    );

    $("pinInput").value="";

    $("confirmPinInput").value="";

    loginMode();

}
function showLockScreen(){

    $("lockScreen").style.display="flex";

    setTimeout(function(){

        $("pinInput").focus();

    },150);

}

function hideLockScreen(){

    $("lockScreen").style.display="none";

}
document.addEventListener(

"DOMContentLoaded",

initializeAuthentication

);
function initializeAuthentication(){

    if(!hasPin()){

        setupMode();

        return;

    }

    if(isLoggedIn()){

        hideLockScreen();

        return;

    }

    loginMode();

}
function setupMode(){

    showLockScreen();

    $("lockHeading").innerHTML="Welcome 👋";

    $("lockSubHeading").innerHTML=

    "Create a 6-digit PIN";

    $("confirmPinInput").style.display="block";

}
function loginMode(){

    showLockScreen();

    $("lockHeading").innerHTML="Welcome Back";

    $("lockSubHeading").innerHTML=

    "Enter your PIN";

    $("confirmPinInput").style.display="none";

}
async function hashPin(pin){

    const encoder = new TextEncoder();

    const data = encoder.encode(pin);

    const hash = await crypto.subtle.digest(

        "SHA-256",

        data

    );

    return Array.from(

        new Uint8Array(hash)

    ).map(

        b => b.toString(16).padStart(2,"0")

    ).join("");

}
document.getElementById(

"unlockBtn"

).addEventListener(

"click",

async function(){

    const pin = $("pinInput").value.trim();

    if(pin.length !== 6){

        alert("PIN must be 6 digits.");

        return;

    }

    if(!hasPin()){

        const confirm =

        $("confirmPinInput").value.trim();

        if(pin !== confirm){

            alert("PINs do not match.");

            return;

        }

        const hashedPin =

        await hashPin(pin);

        localStorage.setItem(

            AUTH.PIN_KEY,

            hashedPin

        );

        loginSuccess();

        return;

    }

    const hashedPin =

    await hashPin(pin);

    const savedHash =

    localStorage.getItem(

        AUTH.PIN_KEY

    );

    if(hashedPin === savedHash){

        loginSuccess();

    }

    else{

        alert("Incorrect PIN");

        $("pinInput").value="";

        $("pinInput").focus();

    }

});
$("pinInput").addEventListener(

"keydown",

function(e){

    if(e.key==="Enter"){

        $("unlockBtn").click();

    }

});

$("confirmPinInput").addEventListener(

"keydown",

function(e){

    if(e.key==="Enter"){

        $("unlockBtn").click();

    }

});
window.addEventListener(

"beforeunload",

function(){

    sessionStorage.removeItem(

        AUTH.SESSION_KEY

    );

});
