const winter = 'winter';
const spring = 'spring';
const summer = 'summer';
const autumn = 'autumn';
const active = 'active_book';
const unactive = 'unactive_book';

const winter_books = document.getElementById(winter);
const spring_books = document.getElementById(spring);
const summer_books = document.getElementById(summer);
const autumn_books = document.getElementById(autumn);

function hideActiveBook() {
  document.querySelectorAll("div.active_book").forEach((e) => { e.classList.toggle('unactive_book') });
};

function removeClass(classNameRemove) {
  document.querySelectorAll(`div.${classNameRemove}`).forEach((e) => { e.classList.remove(`${classNameRemove}`) });
};

function addClass(existClassName, classNameAdd) {
  document.querySelectorAll(`.${existClassName}`).forEach((e) => { e.classList.add(classNameAdd) });
};


function smoothChangeBooks(classExist, classActive, classUnactive) {
  hideActiveBook();

  window.setTimeout(function () {
    removeClass(classActive);
    removeClass(classUnactive);
    addClass(classExist, classActive);
  }, 500);
}

winter_books.addEventListener('change', () => { smoothChangeBooks(winter, active , unactive) });
spring_books.addEventListener('change', () => { smoothChangeBooks(spring, active, unactive) });
summer_books.addEventListener('change', () => { smoothChangeBooks(summer, active, unactive) });
autumn_books.addEventListener('change', () => { smoothChangeBooks(autumn, active, unactive) });