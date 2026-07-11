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

    hideLockScreen();

}
function logout(){

    sessionStorage.removeItem(

        AUTH.SESSION_KEY

    );

    showLockScreen();

}
function showLockScreen(){

    $("lockScreen").style.display="flex";

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
