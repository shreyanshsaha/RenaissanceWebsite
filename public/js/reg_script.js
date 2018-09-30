var fname = document.getElementById('fname'),
    lname = document.getElementById('lname'),
    age = document.getElementById('age'),
    sexe = document.getElementsByClassName('control-group')[0],
    pays = document.getElementById('pays'),
    pseudo = document.getElementById('pseudo'),
    email = document.getElementById('email'),
    password = document.getElementById('password'),
    passwordConf = document.getElementById('passwordConf'),
    send = document.getElementById('send'),
    tabBooleans = [false, false, false, false, false, false, false, false, false];

function up(label, str) {
    var s = document.getElementById(str);
    s.style.borderColor = "#66CC99";
    s.classList.add('up');
    document.getElementsByTagName('label')[label].style.color = "#66CC99";
    tabBooleans[label] = true;
}

function down(label, str) {
    var s = document.getElementById(str);
    s.style.borderColor = "#CACACA";
    s.classList.remove('up');
    tabBooleans[label] = false;
    document.getElementsByTagName('label')[label].style.color = "#CACACA";
}

function checkEmail(label) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.value.length > 0) {
        email.classList.add('up');
        if (reg.test(email.value)) up(label, "email");
        else {
            down(label, 'email');
            email.classList.add('up');
        }
    } else down(label,"email");
}

function checkTxt(id, label, n) {
    var str = document.getElementById(id);
    if (str.value.length >= n) {
        up(label, id);
        if (label == 7) checkPass(8);
    } else {
        if (label == 7) checkPass(8);
        down(label, id);
    }
}

function checkAge(id, label) {
    var Age = parseInt(age.value);
    if (Age > 4 && Age < 141) up(label, id);
    else down(label, id);
}

function checkSexe(sex1, sex2) {
    var sex1 = document.getElementById(sex1),
        sex2 = document.getElementById(sex2);
    if (sex1.checked || sex2.checked) {
        document.getElementsByClassName('sex')[0].style.color = "#66CC99";
        tabBooleans[3] = true;
    }
}

function checkPays(id) {
    var pays = document.getElementById(id);
    if (pays.value != "") {
        pays.style.borderColor = "#66CC99";
        pays.style.color = "#66CC99";
        tabBooleans[4] = true;
    } else {
        pays.style.borderColor = "#CACACA";
        pays.style.color = "#CACACA";
        tabBooleans[4] = false;
    }
}

function checkPass(label) {
    if (password.value.length > 0 && password.value == passwordConf.value)
        up(label, 'passwordConf');
    else
        down(label, 'passwordConf');
}

function verifiedForm() {
    var i = 0,
        valid = 1,
        inscrire = document.getElementById("send");
    for (i in tabBooleans)
        if(tabBooleans[i])
            valid++;
    if (valid == 10) {
        inscrire.removeAttribute("disabled");
    } else {
        inscrire.setAttribute("disabled", true);
    }
    document.getElementById("valid").innerHTML="Valid fields : "+valid+"/10";
}
/* Loading EventListener */
fname.addEventListener('input', function() {
    checkTxt('fname', 0, 2); //min 2 letter hone cahiye
    verifiedForm();
});

lname.addEventListener('input', function() {
    checkTxt('lname', 1, 2); //min 2 letter hone cahiye
    verifiedForm();
});

age.addEventListener('input', function() {
    checkAge('age', 2); //label 2 condition: 5<=age<=140
    verifiedForm();
});

sexe.addEventListener('click', function() {
    checkSexe('male', 'femelle');  
    verifiedForm();
});

pays.addEventListener('change', function() {
    checkPays("pays");
    verifiedForm();
});

pseudo.addEventListener('input', function() {
    checkTxt('pseudo', 5, 4); 
    verifiedForm();
});
email.addEventListener('input', function() {
    checkEmail(6); 
    verifiedForm();
});

password.addEventListener('input', function() {
    checkTxt('password', 7, 6); 
    verifiedForm();
});
passwordConf.addEventListener('input', function() {
    checkPass(8); 
    verifiedForm();
});
// send.addEventListener('click', function(e) {
//     e.preventDefault();
//     alert("You've successfully registered!");
// })