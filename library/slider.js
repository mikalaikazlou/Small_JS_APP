
let position_slider = 1;
let step = -475;

const carusel_slider = document.getElementById('carusel_slider');
const carousel_pagination = document.querySelector('.carousel_pagination');
const btn_one = document.querySelector('.pagination_button.one');
const btn_two = document.querySelector('.pagination_button.two');
const btn_three = document.querySelector('.pagination_button.three');
const btn_four = document.querySelector('.pagination_button.four');
const btn_five = document.querySelector('.pagination_button.five');

const dots = document.querySelectorAll('.pagination_button');
const btn_next = document.querySelector('.btn_slider_right');
const btn_pre = document.querySelector('.btn_slider_left');

function removeActiveClassAll() {
    for (const iterator of dots) {
        iterator.classList.remove('active');
    }
}

function addActiveClass() {
    let index = 0;
    for (const iterator of dots) {
        if ((index + 1) === position_slider) {
            iterator.classList.add("active");
            break;
        }
        index++;
    }
}

function shiftSlideAndSetActiveButton(object, widthShift, number_btn, e) {
    e.stopPropagation();
    removeActiveClassAll();

    // if(carousel_pagination.clientWidth > 78){
    widthShift = widthShift * (number_btn - 1);
    // }
    position_slider = number_btn;
    carusel_slider.style.left = widthShift + "px";
    object.classList.add('active');
}

function shift_Next(widthShift) {
    removeActiveClassAll();
    if (position_slider > 0 && position_slider < 5) {
        carusel_slider.style.left = widthShift * position_slider + "px";
        position_slider++;
    }

    addActiveClass();
}

function shift_Pre(widthShift) {
    removeActiveClassAll();
    let values = widthShift * (position_slider - 2) + "px";

    if (position_slider > 1 && position_slider < 6) {
        carusel_slider.style.left = values;
        position_slider--;
    }
    addActiveClass()

}

btn_one.addEventListener('click', (e) => shiftSlideAndSetActiveButton(btn_one, step, 1, e));
btn_two.addEventListener('click', (e) => shiftSlideAndSetActiveButton(btn_two, step, 2, e));
btn_three.addEventListener('click', (e) => shiftSlideAndSetActiveButton(btn_three, step, 3, e));
btn_four.addEventListener('click', (e) => shiftSlideAndSetActiveButton(btn_four, step, 4, e));
btn_five.addEventListener('click', (e) => shiftSlideAndSetActiveButton(btn_five, step, 5, e));


btn_next.addEventListener('click', () => shift_Next(step));
btn_pre.addEventListener('click', () => shift_Pre(step));