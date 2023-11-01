let user;
let userActive = false;
let isLogin = false;
let isRegister = false;
let hasCardLibrary = false;
let visitCount = 0;
let arrayBooks = {
    bk11: false,
    bk12: false,
    bk13: false,
    bk14: false,
    bk21: false,
    bk22: false,
    bk23: false,
    bk24: false,
    bk31: false,
    bk32: false,
    bk33: false,
    bk34: false,
    bk41: false,
    bk42: false,
    bk43: false,
    bk44: false,
};

let countFillInput = 0;

let checher = {
    inp1: false,
    inp21: false,
    inp22: false,
    inp3: false,
    inp4: false,
    inp5: false,
    inp6: false,
};



const modal = document.querySelector('.modal_window');
const register_button = document.querySelectorAll('.sign_up');
const login_button = document.querySelectorAll('.login_btn');
const logout_button = document.getElementById('logout_btn');
const btn_close_register = document.querySelectorAll('.btn_close_modal');
const logo_unreg = document.getElementById('logoUnregId');
const logo_reg = document.getElementById('logoRegId');
const login_form = document.getElementById('login_form');
const register_form = document.querySelector('form#register_form');
const btn_check_card = document.querySelector('.btn_check_card');
const auth_drop_menu = document.querySelector('div.authorize');
const unauth_drop_menu = document.querySelector('div.un_authorize');
const title_profile = document.querySelector('span.profile_title');
const profile_button = document.querySelectorAll('.profile_btn');
const profile = document.querySelector('div.profile_window');
const buyCard = document.querySelector('div.library_card');
const copy_button = document.querySelector('.copy_btn');
const buy_card_library_btn = document.querySelector('.buy_card_library_btn');

function removeClassName(classExist, object) {
    object.classList.remove(classExist);
}

function getDataFromForm(e) {
    let data = {
        visits: 0,
        books: 0,
        hasCardLibrary: false,
    };

    for (const iterator of e.elements) {
        if (iterator.name.length > 0) {
            data[iterator.name] = iterator.value;
        }
    }

    return data;
}


function addCardLibraryToUser(userIdentity) {
    let userData = JSON.parse(localStorage.getItem(userIdentity));
    if (userData !== null) {
        userData.hasCardLibrary = true;
        localStorage.removeItem(userIdentity);
        localStorage.setItem(userIdentity, JSON.stringify(userData));
        user = null;
        user = userData;
    }
}


function generateCardNumber() {
    let randomNumber = (Math.floor(Math.random() * 1E10)).toString(16).toUpperCase();

    if (randomNumber.length > 9) {
        return randomNumber.slice(0, 9);
    }
    else if (randomNumber.length < 9) {
        while (randomNumber.length < 9) {
            randomNumber += '0';
        }
        return randomNumber;
    }
    else {
        return randomNumber;
    }
}

function setValuesFilledInput(value) {
    countFillInput += value;
    if (countFillInput === 7) {
        document.querySelector('.buy_card_library_btn').disabled = false;
    }
    else {
        document.querySelector('.buy_card_library_btn').disabled = true;
    }
}

function checkInputValues(selector, minLength, maxLength, checkObj, name) {
    let obj = document.querySelector(selector);
    let lengthInputValue = obj.value.length;

    if (lengthInputValue >= minLength && lengthInputValue <= maxLength && checkObj[`${name}`] !== true) {
        setValuesFilledInput(+1);
        checkObj[`${name}`] = true;
    }
    else if ((lengthInputValue < minLength || lengthInputValue > maxLength) && checkObj[`${name}`] === true) {
        setValuesFilledInput(-1);
        checkObj[`${name}`] = false;
    }
}


function addVisitsToUser(userIdentity) {
    let userData = JSON.parse(localStorage.getItem(userIdentity));
    if (userData !== null) {
        userData.visits = Number(userData.visits) + 1;
        localStorage.removeItem(userIdentity);
        localStorage.setItem(userIdentity, JSON.stringify(userData));
        user = null;
        user = userData;
    }
}

function registrationUser(obj, e) {
    e.preventDefault();
    let dataForm = getDataFromForm(obj);
    let identity = dataForm.email;

    let userFIO = dataForm.firstName[0].slice(0, 1) + dataForm.lastName[0].slice(0, 1);
    dataForm.cardNumber = generateCardNumber();

    if (localStorage.getItem(identity) === null) {
        dataForm.visits = Number(1);
        dataForm.arrayBooks = arrayBooks;
        localStorage.setItem(identity, JSON.stringify(dataForm));

        changeLogo();

        logo_reg.innerHTML = userFIO.toUpperCase();
        btn_check_card.removeAttribute('disabled');
        userActive = true;
        user = dataForm;
        isRegister = true;
    }
    else {
        alert(`Пользователь с email ${identity} зарегистрирован!`);
    }
}

function changeLogo() {
    if (!isRegister) {
        logo_unreg.classList.toggle('close');
        logo_reg.classList.toggle('close');
    }
    else {
        logo_unreg.classList.add('close');
        logo_reg.classList.remove('close');
    }
}

function closeModalWindow() {
    removeClassName('open_model_window', modal);
    removeClassName('open_form', document.querySelector('div.registration'));
    removeClassName('open_form', document.querySelector('div.login'));
}

function openLoginWindow() {
    modal.classList.add('open_model_window');
    document.querySelector('.drop_menu_profile').classList.remove('open');
    document.querySelector('div.login').classList.add('open_form');
}

function openRegisterWindow() {
    modal.classList.add('open_model_window');
    document.querySelector('.drop_menu_profile').classList.remove('open');
    document.querySelector('div.registration').classList.add('open_form');
}

function openProfileWindow() {
    toggleClass(modal, 'open_model_window');
    document.querySelector('.drop_menu_profile').classList.remove('open');
    profile.classList.add('open_form');
}

function openCardBuyWindow() {
    toggleClass(modal, 'open_model_window');
    document.querySelector('.drop_menu_profile').classList.remove('open');
    buyCard.classList.add('open_form');
}

function loginUser(obj, e) {
    e.preventDefault();
    let data = getDataFromForm(obj);
    const userData = JSON.parse(localStorage.getItem(data.email));

    if (userData.password === data.password) {
        logo_reg.setAttribute('title', userData.firstName + ' ' + userData.lastName);
        logo_reg.innerHTML = userData.firstName[0].toUpperCase() + userData.lastName[0].toUpperCase();
        isLogin = true;
        addVisitsToUser(data.email);
    }

    if (isRegister || isLogin) {
        btn_check_card.removeAttribute('disabled');
    }

    if (isLogin) {
        title_profile.innerHTML = userData.cardNumber;
        user = userData;
        fillProfileData()
        closeCards();

        document.querySelectorAll('.book_btn').forEach((e) => {
            let idName = e.id;
            const userData = JSON.parse(localStorage.getItem(user.email));
            let valueBookInData = userData.arrayBooks[`${idName}`];
            if (valueBookInData === true) {
                e.classList.add("own");
                e.classList.remove('buy');
                e.innerHTML = 'Own';
                e.disabled = true;
                e.style.cursor = 'auto';
            }
        });
    }

}

function fillProfileData() {
    document.querySelector('.avatar').innerHTML = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
    document.querySelector('.name').innerHTML = user.firstName + " " + user.lastName;
    document.querySelector('.card_values').innerHTML = user.cardNumber;

    document.querySelector('input.firstName').value = user.firstName + " " + user.lastName;
    document.querySelector('input.lastName').value = user.cardNumber;

    document.querySelectorAll('.count_books').forEach((e) => {
        e.innerHTML = JSON.parse(localStorage.getItem(user.email)).books;
    });
    document.querySelectorAll('.count_visit').forEach((e) => {
        e.innerHTML = JSON.parse(localStorage.getItem(user.email)).visits;
    });
}

function resetCounterBook(userIdentity) {
    let userData = JSON.parse(localStorage.getItem(userIdentity));
    if (userData !== null) {
        userData.books = 0;
        localStorage.removeItem(userData.email);
        localStorage.setItem(userData.email, JSON.stringify(userData));
        user = null;
        user = userData;
    }
}

login_button.forEach((e) => {
    e.addEventListener('click', function (event) {
        event.stopPropagation();
        closeModalWindow();
        if (drop_menu.classList.contains('open')) {
            closeBurgerMenu();
        }
        if (!isLogin) {
            openLoginWindow();
        }
    })
});

register_button.forEach((e) => {
    e.addEventListener('click', function (event) {
        event.stopPropagation();
        closeModalWindow();
        openRegisterWindow();

        if (drop_menu.classList.contains('open')) {
            closeBurgerMenu(e);
        }
    })
});

logout_button.addEventListener('click', (e) => {
    e.stopPropagation();
    btn_check_card.disabled = true;

    document.querySelectorAll('.book_btn').forEach((e) => {
        e.classList.add("buy");
        e.classList.remove('own');
        e.innerHTML = 'Buy';
        e.disabled = false;
        e.style.cursor = 'pointer';
    });

    user = null;
    isLogin = false;
    isRegister = false;
    title_profile.innerHTML = "Profile";
    toggleClass(unauth_drop_menu, 'open');
    toggleClass(auth_drop_menu, 'open');
    drop_menu.classList.remove('open');
    removeClassName('open_model_window', modal);
    removeClassName('open_form', document.querySelector('div.profile_window'));
    removeClassName('open_form', document.querySelector('div.registration'));
    removeClassName('open_form', document.querySelector('div.login'));
    changeLogo();
    closeCards();

    drop_menu.classList.remove();
});

profile_button.forEach((e) => {
    e.addEventListener('click', function (event) {
        event.stopPropagation();
        fillProfileData()
        openProfileWindow();
    })
});

btn_close_register.forEach((e) => {
    e.addEventListener('click', function (event) {
        event.stopPropagation();
        toggleClass(modal, 'open_model_window');
        removeClassName('open_form', document.querySelector('div.registration'));
        removeClassName('open_form', document.querySelector('div.login'));
        removeClassName('open_form', document.querySelector('div.library_card'));
    });
})


register_form.addEventListener('submit', (e) => {
    registrationUser(register_form, e);
    closeModalWindow();
    resetInputValues('form#register_form');
});

login_form.addEventListener('submit', (e) => {

    loginUser(login_form, e);
    changeLogo();
    unauth_drop_menu.classList.remove('open');
    auth_drop_menu.classList.add('open');

    btn_check_card.removeAttribute('disabled');
    closeModalWindow();
    resetInputValues('#login_form');

});

buy_card_library_btn.addEventListener('click', (e) => {
    addCardLibraryToUser(user.email);
    closeModalWindow();
    removeClassName('open_form', document.querySelector('div.library_card'));
    resetInputValues("#form_buy_book");
 
});


document.querySelector('#bank_card_number').addEventListener('keyup', (e) => {
    checkInputValues('#bank_card_number', 16, 16, checher, 'inp1');
});
document.querySelector('#exp_code1').addEventListener('keyup', (e) => {
    checkInputValues('#exp_code1', 2, 2, checher, 'inp21');
});
document.querySelector('#exp_code2').addEventListener('keyup', (e) => {
    checkInputValues('#exp_code2', 2, 2, checher, 'inp22');
});
document.querySelector('#cvc').addEventListener('keyup', (e) => {
    checkInputValues('#cvc', 3, 3, checher, 'inp3');
});
document.querySelector('#cardholder').addEventListener('keyup', (e) => {
    checkInputValues('#cardholder', 1, 20, checher, 'inp4');
});
document.querySelector('#postal_code').addEventListener('keyup', (e) => {
    checkInputValues('#postal_code', 1, 10, checher, 'inp5');
});
document.querySelector('#city_name').addEventListener('keyup', (e) => {
    checkInputValues('#city_name', 1, 20, checher, 'inp6');
});