const burger_btn = document.getElementById('burger_btn');
const navbar = document.getElementById('navigation');
const navigation_list = document.getElementById('navigation_list');
const card_form = document.querySelector('#formCardCheckId');
const button_card_check_form = document.querySelector('.btn_check_card');
const windows_width = window.matchMedia('(min-width:1025px)');
const button_buys = document.querySelectorAll('.book_btn');

windows_width.addListener(controlWindosSize);
controlWindosSize(windows_width);


burger_btn.addEventListener('click', function (event) {
    event.stopPropagation();
    openBurgerMenu();
    if (drop_menu.classList.contains('open')) {
        removeClassName('open', drop_menu);
    }
}, false);

navigation_list.addEventListener('click', function () {
    closeBurgerMenu();
    if (drop_menu.classList.contains('open')) {
        removeClassName('open', drop_menu);
    }
}, false);

document.body.addEventListener('click', function () {
    if (burger_btn.className === 'burger_close_btn_visible') {
        burger_btn.className = "burger_open_btn";
        navbar.className = "header_item";
        navigation_list.className = "nav_list";
    }
    if (drop_menu.classList.contains('open')) {
        removeClassName('open', drop_menu);
    }
    // if(modal.classList.contains('open_model_window')){
    //     removeClassName('open_model_window', modal);
    // }
}, false);

function closeBurgerMenu() {
    transformClassName("burger_close_btn_visible", "burger_open_btn", burger_btn);
    transformClassName("nav_open_burger_menu", "header_item", navbar);
    transformClassName("navigation_list_ul", "nav_list", navigation_list);
}

function openBurgerMenu(e) {
    changeClassesName("burger_open_btn", "burger_close_btn_visible", burger_btn);
    changeClassesName("nav_open_burger_menu", "header_item", navbar);
    changeClassesName("navigation_list_ul", "nav_list", navigation_list);
}

function changeClassesName(oldClass, newClass, object) {
    if (object.className === oldClass) {
        object.className = newClass;
    }
    else {
        object.className = oldClass;
    }
}

function transformClassName(oldClass, newClass, object) {
    if (object.className === oldClass) {
        object.className = newClass;
    }
}

function removeClassName(classExist, object) {
    object.classList.remove(classExist);
}

function controlWindosSize(params) {
    if (params.matches) {
        closeBurgerMenu();
    }
}

function toggleClass(object, classToggle) {
    object.classList.toggle(classToggle);
}

const icon_profile = document.querySelectorAll('.icon_profile');
const drop_menu = document.querySelector('.drop_menu_profile');

icon_profile.forEach((e) => {
    e.addEventListener('click', function (e) {
        e.stopPropagation();
        closeBurgerMenu();
        toggleClass(drop_menu, 'open');
    })
});

function closeCards() {
    resetInputValues('#formCardCheckId');
    toggleClass(document.querySelector('div.reg'), 'close');
    toggleClass(document.querySelector('div.unreg'), 'close');
}

function resetInputValues(formObj) {
    document.querySelector(formObj).reset();
}

function addBookToOwn() {
    let userData = JSON.parse(localStorage.getItem(user.email));
    if (userData !== null) {
        userData.books += 1;
        localStorage.removeItem(userData.email);
        localStorage.setItem(userData.email, JSON.stringify(userData));
        user = null;
        user = userData;
    }
}

button_card_check_form.addEventListener('click', () => {
    let form = getDataFromForm(card_form);
    let userData = JSON.parse(localStorage.getItem(user.email));

    if (form.firstName[0] === userData.firstName[0] && form.cardNumber[0] === userData.cardNumber[0]) {
        fillProfileData();
        toggleClass(document.querySelector('div.reg'), 'close');
        toggleClass(document.querySelector('div.unreg'), 'close');

        setTimeout(closeCards, 10000);
    }
}
);

button_buys.forEach((e) => {
    e.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!isLogin) {
            openLoginWindow();
        }
        else if (isLogin && !user.hasCardLibrary) {
            openCardBuyWindow();
        }
        else if (isLogin && user.hasCardLibrary) {
            addBookToOwn();
            const userData = JSON.parse(localStorage.getItem(user.email));
            if (userData !== null) {
                if(userData.arrayBooks[`${this.id}`] === false){
                    user.arrayBooks[`${this.id}`] = true;
                    localStorage.removeItem(user.email);
                    localStorage.setItem(user.email, JSON.stringify(user));
                    user = JSON.parse(localStorage.getItem(user.email));
                }
            }
            this.classList.add("own");
            this.classList.remove('buy');
            this.innerHTML = 'Own';
            this.disabled = true;
            this.style.cursor = 'auto';
     fillProfileData();

        }
    })
});


console.log(`196/200\n1.Модальные окна регистрации, входа, профайла и покупки карты библиотеки, закрываются только нажатием на крестик, нажав на область вне окна, окно не закрывается `);