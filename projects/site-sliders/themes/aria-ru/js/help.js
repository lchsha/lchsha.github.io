 
const body = document.querySelector("html");

if (_getLocalSelector("color-html")) {
    body.classList.add(_getLocalSelector("color-html"));
}
if (_getLocalSelector("size-html")) {
    body.classList.add(_getLocalSelector("size-html"));
}
 
function _getLocalSelector(name) {
    return JSON.parse(localStorage.getItem(name));
}

function _setLocalSelector(name, arg) {
    localStorage.setItem(name, JSON.stringify(arg));
}
 