/* =====================================
        MoneyPilot Auth
===================================== */

const PIN_KEY =

"moneyPilotPin";

function hasPin(){

    return localStorage.getItem(

        PIN_KEY

    ) !== null;

}
function hideLock(){

    document.getElementById(

        "lockScreen"

    ).style.display="none";

}
function showLock(){

    document.getElementById(

        "lockScreen"

    ).style.display="flex";

}
let firstSetup = false;

document.addEventListener(

"DOMContentLoaded",

function(){

    firstSetup = !hasPin();

    const confirmInput =

    document.getElementById(

        "confirmPinInput"

    );

    if(firstSetup){

        document.getElementById(

            "lockTitle"

        ).innerHTML = "Create PIN";

        document.getElementById(

            "pinHint"

        ).innerHTML = "Choose a secure 6-digit PIN";

        confirmInput.style.display = "block";

    }

});
document.getElementById(

"unlockBtn"

).onclick = function(){

    const pin =

    document.getElementById(

        "pinInput"

    ).value;

    if(pin.length !== 6){

        alert("PIN must be 6 digits");

        return;

    }

    if(firstSetup){

        const confirm =

        document.getElementById(

            "confirmPinInput"

        ).value;

        if(pin !== confirm){

            alert("PIN does not match");

            return;

        }

        localStorage.setItem(

            PIN_KEY,

            pin

        );

        hideLock();

        return;

    }

    const savedPin =

    localStorage.getItem(

        PIN_KEY

    );

    if(pin === savedPin){

        hideLock();

    }

    else{

        alert("Wrong PIN");

    }

};
