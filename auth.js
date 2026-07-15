/* ===========================================
        MoneyPilot Authentication V2
=========================================== */

const AUTH = {

    PIN_KEY: "mp_pin_hash",

    SESSION_KEY: "mp_session",

    SECURITY_SETUP_KEY: "mp_security_setup",

    SECURITY_QUESTION_KEY: "mp_security_question",

    SECURITY_ANSWER_KEY: "mp_security_answer",

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

function hasSecuritySetup(){

    return localStorage.getItem(

        AUTH.SECURITY_SETUP_KEY

    ) === "true";

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

    /* Force one-time security setup */

    if(!hasSecuritySetup()){

        showSecuritySetup();

        return;

    }

    hideLockScreen();

    if(typeof updateGreeting === "function"){

        updateGreeting();

    }

    if(typeof calculateDashboard === "function"){

        calculateDashboard();

    }

    if(typeof refreshDashboard === "function"){

        refreshDashboard();

    }

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

function showSecuritySetup(){

    hideLockScreen();

    $("securitySetupPage").classList.add("active");

}

function hideSecuritySetup(){

    $("securitySetupPage").classList.remove("active");

}

function showForgotPin(){

    hideLockScreen();

    hideSecuritySetup();

    $("forgotPinPage").classList.add("active");

    $("forgotQuestion").innerHTML =

        localStorage.getItem(

            AUTH.SECURITY_QUESTION_KEY

        );

}

function hideForgotPin(){

    $("forgotPinPage").classList.remove("active");

}

function showResetPinPage(){

    hideForgotPin();

    $("resetPinPage").classList.add("active");

}

function hideResetPinPage(){

    $("resetPinPage").classList.remove("active");

}

async function verifySecurityAnswer(){

    const answer =

    $("forgotAnswer").value.trim();

    if(answer===""){

        alert("Please enter your answer.");

        return;

    }

    const hashedAnswer =

    await hashPin(

        answer.toLowerCase()

    );

    const savedHash =

    localStorage.getItem(

        AUTH.SECURITY_ANSWER_KEY

    );

    if(hashedAnswer!==savedHash){

        alert("Incorrect answer.");

        $("forgotAnswer").value="";

        $("forgotAnswer").focus();

        return;

    }

    showResetPinPage();

}


async function saveSecuritySetup(){

    const question =

    $("securityQuestion").value.trim();

    const answer =

    $("securityAnswer").value.trim();

    if(question===""){

        alert("Please select a security question.");

        return;

    }

    if(answer===""){

        alert("Please enter your answer.");

        return;

    }

    const hashedAnswer =

    await hashPin(answer.toLowerCase());

    localStorage.setItem(

        AUTH.SECURITY_QUESTION_KEY,

        question

    );

    localStorage.setItem(

        AUTH.SECURITY_ANSWER_KEY,

        hashedAnswer

    );

    localStorage.setItem(

        AUTH.SECURITY_SETUP_KEY,

        "true"

    );

    hideSecuritySetup();

    loginSuccess();

}

$("saveSecurityBtn").addEventListener(

    "click",

    saveSecuritySetup

);

$("forgotPinBtn").addEventListener(

    "click",

    function(){

        showForgotPin();

    }

);

$("verifySecurityBtn").addEventListener(

    "click",

    verifySecurityAnswer

);


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

    if(typeof updateGreeting === "function"){

        updateGreeting();

    }

    if(typeof calculateDashboard === "function"){

        calculateDashboard();

    }

    return;

}

    loginMode();

}
function setupMode(){

    showLockScreen();

    $("lockHeading").innerHTML="Welcome 👋";

    $("lockSubHeading").innerHTML=
    "Let's setup your MoneyPilot";

    $("userNameInput").style.display="block";

    $("confirmPinInput").style.display="block";

}
function loginMode(){

    showLockScreen();

    $("lockHeading").innerHTML="Welcome Back";

    const userName =
    localStorage.getItem("mp_user_name") || "";

    $("lockSubHeading").innerHTML=
    userName;

    $("userNameInput").style.display="none";

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

    const name =

    $("userNameInput").value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

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

    localStorage.setItem(

        "mp_user_name",

        name

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
