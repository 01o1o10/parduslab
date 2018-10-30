
function readLoginModal(cb){
    userInfo.uname = document.getElementById('login-uname').value
    userInfo.pass = document.getElementById('login-pass').value
    cb(userInfo)
}

function readRegisterModal(cb){
    var registerData = {}
    registerData.fname = document.getElementById('register-fname').value
    registerData.lname = document.getElementById('register-lname').value
    registerData.uname = document.getElementById('register-uname').value
    registerData.pass = document.getElementById('register-pass').value
    registerData.city = document.getElementById('register-city').value

    if(!registerData.fname || !registerData.lname || !registerData.uname || !registerData.pass || !registerData.city){
        info('#register' ,'Alanlar boş bırakılamaz!', false)
    }
    else {
        cb(registerData)
    }
}

function info(id, message, succes){
    var div
    if(succes){
        div = $(id + '-succes')
        div.html('<b>Succes!</b> ' + message)
    }
    else {
        div = $(id + '-failed')
        div.html('<b>Failed!</b> ' + message)
    }
    div.slideDown("slow")
    setTimeout(() => {
        div.slideUp("slow")
    }, 3000);
}