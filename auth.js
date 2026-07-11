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
