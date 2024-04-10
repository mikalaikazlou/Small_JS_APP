let languageName = "eng";
let count = 0;
let wordLength = 0;
let atemptGuess = 6;
let guessCount = 0;
let unguessCount = 0;
let guessCharsArray = [];
let hiddenWordArray = [];
let hiddenCharsArray = [];

let isWin = false;
let questionDataFromJSON;

let questionData;

const dataPath = "./questions.json";


const keybordLayoutRu = {
    resultWin: "Победа",
    resultOver: "Игра закончена",
    guessCount: "Количество неправильных попыток: ",
    btnRestart: "Новая игра",
    btnCancel: "Закончить",
    hint: "Подсказка: ",
    name: "Игра Палач",
};


const keybordLayoutEng = {
    resultWin: "WIN",
    resultOver: "GAME OVER",
    guessCount: "Incorrect guesses: ",
    btnRestart: "Play again",
    // btnCancel: "Cancel",
    hint: "Hint: ",
    name: "Hangman game",
};

const engKeyBoard = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
];

const ruKeyBoard = [
    "Ё",
    "Й",
    "Ц",
    "У",
    "К",
    "Е",
    "Н",
    "Г",
    "Ш",
    "Щ",
    "З",
    "Х",
    "Ъ",
    "Ф",
    "Ы",
    "В",
    "А",
    "П",
    "Р",
    "О",
    "Л",
    "Д",
    "Ж",
    "Э",
    "Я",
    "Ч",
    "С",
    "М",
    "И",
    "Т",
    "Ь",
    "Б",
    "Ю",
];

const QUIZ_WORD = {
    id: 1,
    wordRu: "ТЕРМИНАЛ",
    questionRu: "Что-то на русском написать надо?",
    wordEng: "TERMINAL",
    questionEng: "WTF idfdsf sdf dfs ttds farts off?",
};

const coordinateFigure = [
    [10, 270, 250, 270],//floor
    [50, 270, 50, 20],//
    [50, 40, 70, 20],
    [50, 20, 170, 20],
    [170, 20, 170, 60],
    [170, 80, 20, 0],//head
    [170, 100, 170, 160],//body
    [170, 100, 140, 140],//arm rigth
    [170, 100, 200, 140],//arm left
    [170, 160, 140, 200],//leg rigth
    [170, 160, 200, 200],//leg left
];

const coordinateSmallFigure = [
    [20, 110, 190, 110],//floor
    [50, 110, 50, 10],//
    [50, 30, 70, 10],
    [50, 10, 140, 10],
    [140, 10, 140, 30],
    [140, 40, 10, 0],//head
    [140, 50, 140, 80],//body
    [140, 50, 125, 70],//arm rigth
    [140, 50, 155, 70],//arm left
    [140, 80, 125, 100],//leg rigth
    [140, 80, 155, 100],//leg left
];

const block_keyboard = document.querySelector(".block_keyboard");
const selectElem = document.querySelector(".lang_choose");
const counter = document.querySelector(".counter");
const question_word = document.querySelector(".question_word");
const questionChars = document.querySelectorAll(".chars");
const question = document.querySelector(".question");
const modal = document.querySelector(".modal");
const result_game = document.querySelector(".result_game");
const btn_restart = document.querySelector(".restart");
let mediaQuery = window.matchMedia('(width < 850px)');

/*********************************************************************************************** */
/*********************************************************************************** listeners **/
/************************************* */
document.addEventListener("keydown", (e) => {
    e.preventDefault();
    let char = e.key.toLocaleUpperCase();
    if (e.code.includes("Key", 0) || char === 'Х'|| 
    char === 'Ъ'|| char === 'Ж'|| char === 'Э'||
    char === 'Б'|| char === 'Ю') {
        searchCharInWord(e.key.toUpperCase());
    }
});
//выбор из выпадающего списка языка, после чего обновляем раскладку клавиатуры и загаданное слово
selectElem.addEventListener("change", (e) => {
    createKeyboard(selectElem.value);
    updateListenersOfChars();
    createOrUpdateQuestionWord(QUIZ_WORD, selectElem.value);
    languageName = selectElem.value;
    changeLayoutPage(languageName);
    updateAtemptInfo(selectElem.value);
    hiddenMan();
    //add update word other language
});

btn_restart.addEventListener("click", () => {
    unguessCount = 0;
    closeModalWindow();
    createKeyboard(languageName);
    updateListenersOfChars();
    createOrUpdateQuestionWord(QUIZ_WORD, languageName);
    updateAtemptInfo(languageName);
    hiddenMan();
});

changeFigure(mediaQuery);
mediaQuery.addListener(changeFigure);

function changeFigure(mediaQuery) {
    if (mediaQuery.matches) {
        updateSizesOfFigureSvg(coordinateSmallFigure);
    } else {
        updateSizesOfFigureSvg(coordinateFigure);
    }
}
/************************************* */
/************************************* */


/*********************************************************************************************** */
/*********************************************************************************** functions **/
/************************************* */

async function getData(params) {
    let data = await fetch(params, {
        method: "GET",
    }).then((response) => {
        return response.json();
    });
    return await data;
}

async function takeQuestionFromArray() {
    const index = Math.floor(Math.random() * 10);
    questionDataFromJSON = await getData(dataPath);
    if (questionDataFromJSON.length >= index - 1) {
        questionData = questionDataFromJSON[index];
    } else {
        questionData = questionDataFromJSON[0];
    }
}

async function getQuestionByLanguage(quize, lang = "eng") {
    await takeQuestionFromArray();
    if (questionData) {
        quize = questionData;
    }

    if (lang === "ru") {
        return quize.wordRu;
    } else {
        return quize.wordEng;
    }
}

function createKeyboard(lang) {
    const clearKeyBoard = document.querySelector(".keyboard");
    if (clearKeyBoard !== null) {
        clearKeyBoard.remove();
    }

    let board = [];
    if (lang === "ru") {
        board = ruKeyBoard;
    } else {
        board = engKeyBoard;
    }
    const keyboard = document.createElement("div");
    keyboard.classList.add("keyboard");
    for (let index = 0; index < board.length; index++) {
        const charElem = document.createElement("div");
        charElem.classList.add("keyboard_char");
        charElem.innerHTML = board[index];
        keyboard.append(charElem);
    }
    block_keyboard.append(keyboard);
}

function createQuestionWindow(quize, lang = "eng") {
    let qtn_word;
    let layout;
    if (lang === "ru") {
        qtn_word = quize.questionRu;
        layout = keybordLayoutRu;
        //исключаем повторение символов в слове
        wordLength = [...new Set(quize.wordRu)].length;
    } else {
        qtn_word = quize.questionEng;
        layout = keybordLayoutEng;
        wordLength = [...new Set(quize.wordEng)].length;
    }
    let questionInnerHtml = `<span><span class="text_upper">${layout.hint}</span>${qtn_word}</span>`;
    question.innerHTML = questionInnerHtml;
}


function openModalWindow() {
    modal.classList.add("active");
}

function closeModalWindow() {
    modal.classList.remove("active");
}


function updateCounter() {
    count++;
    if (guessCount === wordLength) {
        isWin = true;
        setTimeout(() => finishGame(isWin), 300);
    }
    if (atemptGuess === unguessCount) {
        isWin = false;
        setTimeout(() => finishGame(isWin), 300);
    }
}

function updateListenersOfChars() {
    let keyboard_char = document.querySelectorAll(".keyboard_char");
    keyboard_char.forEach((value) => {
        value.addEventListener("click", () => {
            searchCharInWord(value.innerHTML);
        });
    });
}

function changeLayoutPage(params) {
    let keybordLayout;
    if (params === "eng") {
        keybordLayout = keybordLayoutEng;
    } else {
        keybordLayout = keybordLayoutRu;
    }

    document.querySelector(".restart").innerHTML = keybordLayout.btnRestart;
    document.querySelector(".result_game").innerHTML = isWin
        ? keybordLayout.resultWin
        : keybordLayout.resultOver;
    document.querySelector(".game_name").innerHTML = keybordLayout.name;
}

function updateAtemptInfo(params = "eng") {
    let keybordLayout;
    if (params === "eng") {
        keybordLayout = keybordLayoutEng;
    } else {
        keybordLayout = keybordLayoutRu;
    }
    let countAtempt = document.querySelector(".counter");
    let wordInner = `<span>${keybordLayout.guessCount} <span class="red_text">${unguessCount}/${atemptGuess}</span></span>`;
    countAtempt.innerHTML = wordInner;
}

async function createOrUpdateQuestionWord(quize, lang = "eng") {
    if (questionChars !== null) {
        document.querySelectorAll(".chars").forEach((el) => {
            el.remove();
        });
    }
    hiddenCharsArray = [];
    guessCharsArray = [];
    let wordGuess = await getQuestionByLanguage(quize, lang);
    createQuestionWindow(questionData, lang);

    for (let index = 0; index < wordGuess.length; index++) {
        const charElem = document.createElement("div");
        charElem.classList.add("chars");
        hiddenCharsArray.push(wordGuess[index]);
        question_word.append(charElem);
    }
}

function searchCharInWord(word) {
    let isGuess = false;
    let gff = document.querySelectorAll(".chars");
    let index = 0;
    for (const iterator of hiddenCharsArray) {
        if (iterator.toUpperCase() === word.toUpperCase()) {
            if (!guessCharsArray.includes(word)) {
                guessCharsArray.push(word);
                guessCount++;
                isGuess = true;
            }
            gff[index].innerHTML = word.toUpperCase();
        }
        index++;
    }

    if (!isGuess) {
        unguessCount++;
        addPartFigureMan();
        updateAtemptInfo(languageName);
    }
    updateCounter();
}

function finishGame(isWin) {
    let keybordLayout;
    if (languageName === "eng") {
        keybordLayout = keybordLayoutEng;
    } else {
        keybordLayout = keybordLayoutRu;
    }

    if (!isWin) {
        console.log("GAME OVER!");
        result_game.innerHTML = keybordLayout.resultOver;
    } else {
        console.log("WIN!");
        result_game.innerHTML = keybordLayout.resultWin;
    }

    openModalWindow();
    count = 0;
    guessCount = 0;
    unguessCount = 0;
    // counter.innerHTML = count;
}

function removeSvgFigure() {
    let elem = document.querySelector("svg.hangman_figure");
    if (elem) {
        elem.remove();
    }
}

function addPartFigureMan() {
    let elements = document.querySelectorAll(".part_man:not(.show_part)");
    elements[0].classList.add('show_part');
}

function hiddenMan() {
    let elements = document.querySelectorAll(".part_man.show_part");
    elements.forEach((e) => {
        e.classList.remove('show_part');
    })
}

function updateSizesOfFigureSvg(coordFigure) {
    const elements = document.querySelectorAll(".part_figure");
    let X = 0;
    for (const iterator of elements) {
        if (X === 5) {
            iterator.setAttribute("cx", coordFigure[X][0]);
            iterator.setAttribute("cy", coordFigure[X][1]);
            iterator.setAttribute("r", coordFigure[X][2]);
        } else {
            iterator.setAttribute("x1", coordFigure[X][0]);
            iterator.setAttribute("y1", coordFigure[X][1]);
            iterator.setAttribute("x2", coordFigure[X][2]);
            iterator.setAttribute("y2", coordFigure[X][3]);
        }
        X++;
    }
}
/************************************* */
/************************************* */


createOrUpdateQuestionWord(QUIZ_WORD, (lang = "eng"));
createQuestionWindow(QUIZ_WORD, (lang = "eng"));
createKeyboard();
updateListenersOfChars();
updateAtemptInfo(languageName);