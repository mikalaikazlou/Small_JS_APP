const place = document.querySelector(".window_game");
const left_btn = document.querySelector(".left");
const right_btn = document.querySelector(".right");
const restart = document.querySelector(".restart");
const play_btn = document.querySelector(".play");
const result_story_btn = document.querySelector(".result_list");

const intervalTimes = 200;
const start_x_position = 4;
const start_y_position = 2;
const result_key = "result";
let scoreData = [];
let timer;
let startPosX = start_x_position;
let startPosY = start_y_position;
let bottomPositionEnd = 19;
let isBottom = false;
let isFreeRightSide = true;
let isFreeLeftSide = true;
let isGameOver = false;
let points = 0;
let figureNumber = 0;

//first x position, second - y
let figure = [
  // figure I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ],

  //square
  [
    [0, 1, 0, -1],
    [0, 0, 1, 0],
  ],
  /// T
  // [
  //   [0, 1, 1, -1],
  //   [0, 0, 0, 1],
  // ],
];
function resetRow(row) {
  let r = document.querySelectorAll(`.moved[posy = "${row}"]`);
  r.forEach((e) => {
    e.classList.remove("moved");
  });
  points += 10;
  document.querySelector(`.title`).innerHTML = points;
}

function removeBlocksAfterGetPoint(row) {
  for (let indexRow = row; indexRow > 1; indexRow--) {
    for (let indexColumn = 0; indexColumn < 10; indexColumn++) {
      let blockTop = document.querySelector(
        `[posX= "${indexColumn}"][posy= "${indexRow - 1}"]`
      );
      let blockDown = document.querySelector(
        `[posX="${indexColumn}"][posy= "${indexRow}"]`
      );
      let isMoved = blockTop.classList.contains("moved");
      if (isMoved) {
        blockDown.classList.add("moved");
      } else {
        blockDown.classList.remove("moved");
      }
    }
  }
}

function isFilledArrow() {
  let blocks = document.querySelectorAll(".empty");
  for (let index = bottomPositionEnd; index >= 0; index--) {
    let countMovedRow = 0;
    for (let index2 = 0; index2 < 9; index2++) {
      if (
        document.querySelector(`.moved[posy = "${index}"][posx = "${index2}"]`)
      ) {
        countMovedRow++;
      }
    }
    if (countMovedRow === 9) {
      resetRow(index);
      removeBlocksAfterGetPoint(index);
      return;
    }
  }
}

function getWidthFigure() {
  let obj = array_coordinateX_underFigure(document.querySelectorAll(".fill"));
  return obj.length;
}

function setRandomFigure() {
  let result = Math.round(Math.random());
  figureNumber = result;
  return result;
}

function array_coordinateX_underFigure(obj) {
  let s = [];
  for (let index = 0; index < obj.length; index++) {
    let e = obj[index];
    s.push(+e.getAttribute("posx"));
  }

  return Array.from(new Set(s));
}

function array_coordinateY_underFigure(obj) {
  let s = [];
  for (let index = 0; index < obj.length; index++) {
    let e = obj[index];
    s.push(+e.getAttribute("posy"));
  }

  return Array.from(new Set(s));
}

function isFreeSide(side) {
  let result = true;
  let obj = array_coordinateX_underFigure(document.querySelectorAll(".fill"));
  let objY = array_coordinateY_underFigure(document.querySelectorAll(".fill"));

  if (side === "right") {
    let maxRightValueOfFigure = Math.max(...obj);
    if (maxRightValueOfFigure > 9 - getWidthFigure() / 2) {
      return false;
    }

    let rightSideFigure = document.querySelectorAll(
      `.moved[posx = "${maxRightValueOfFigure + 1}"]`
    );

    if (rightSideFigure.length === 0) {
      return true;
    }
    for (let index = 0; index <= objY.length; index++) {
      let nextBlockAfterFigure = document.querySelector(
        `.moved[posy = "${objY[index]}"][posx = "${maxRightValueOfFigure + 1}"]`
      );
      if (nextBlockAfterFigure !== null) {
        return false;
      }
    }
    if (
      document.querySelector(
        `.moved[posy = "${objY[objY.length - 1] + 1}"][posx = "${
          maxRightValueOfFigure + 1
        }"]`
      )
    ) {
      return false;
    }
  }

  if (side === "left") {
    let maxLeftValueOfFigure = Math.min(...obj);
    if (maxLeftValueOfFigure <= 0) {
      return (result = false);
    }

    let leftSideFigure = document.querySelectorAll(
      `.moved[posx = "${maxLeftValueOfFigure - 1}"]`
    );

    if (leftSideFigure.length === 0) {
      return true;
    }
    for (let index = 0; index <= objY.length; index++) {
      let nextBlockAfterFigure = document.querySelector(
        `.moved[posy = "${objY[index]}"][posx = "${maxLeftValueOfFigure - 1}"]`
      );
      if (nextBlockAfterFigure !== null) {
        return (result = false);
      }
    }
  }
  return result;
}

function checkForStopFigure(params) {
  let range = bottomPositionEnd - startPosY;
  let bottom_y_max = 0;
  let top_y_max = 0;
  let bottom_y_min = 19;

  isFilledArrow();
  isFreeLeftSide = isFreeSide("left");
  isFreeRightSide = isFreeSide("right");

  //берем все закрашенные квадраты, и проверяем по осям приближение фигуры
  let figure1 = document.querySelectorAll(".fill");
  let arrayX_FillBlocks = array_coordinateX_underFigure(figure1).sort();

  for (let index = 0; index < arrayX_FillBlocks.length; index++) {
    //массив падающих кубиков где X= arrayX_FillBlocks[index]
    let top_elem = document.querySelectorAll(
      `.fill[posx= "${arrayX_FillBlocks[index]}"]`
    );

    //массив упавших кубиков где X= arrayX_FillBlocks[index]
    let bottom_elem = document.querySelectorAll(
      `.moved[posx= "${arrayX_FillBlocks[index]}"]`
    );

    if (top_elem !== null) {
      //перебор всех элементов которые в движении по оси Y
      for (let index1 = 0; index1 < top_elem.length; index1++) {
        top_y_max =
          +top_y_max < +top_elem[index1].getAttribute("posy")
            ? +top_elem[index1].getAttribute("posy")
            : +top_y_max;
      }

      //перебор и выбор самого высого из всех элементов, которые лежат снизу под движущейся фигурой по оси Y
      for (let index2 = 0; index2 < bottom_elem.length; index2++) {
        bottom_y_min =
          +bottom_y_min > +bottom_elem[index2].getAttribute("posy")
            ? +bottom_elem[index2].getAttribute("posy")
            : +bottom_y_min;
      }

      range =
        +bottom_y_min - +top_y_max >= range ? range : bottom_y_min - top_y_max;
      bottom_y_max =
        bottom_y_max < +bottom_y_min && +bottom_y_min - +top_y_max >= range
          ? +bottom_y_min
          : bottom_y_max;

      if (range === 0) {
        isBottom = true;
        clearInterval(timer);
        document.querySelectorAll(".fill").forEach((e) => {
          e.classList.add("moved");
        });
        break;
      }
    }
  }

  bottomPositionEnd = +bottom_y_min;
  if (range - 1 <= 0 && bottomPositionEnd <= start_y_position) {
    clearInterval(timer);
    saveResult(result_key);
    // alert(`Game over! Your score is ${points}`);
    // alert(getResult(result));
    finishGame();
    isGameOver = true;
  }

  if (range - 1 === 0 && bottomPositionEnd < 19) {
    isBottom = true;
    clearInterval(timer);
    document.querySelectorAll(".fill").forEach((e) => {
      e.classList.add("moved");
    });
  }
}

function createScreen() {
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      let element = document.createElement("div");
      element.classList.add("empty");
      element.setAttribute("posX", x);
      element.setAttribute("posY", y);
      place.appendChild(element);
    }
  }
}

function createFigure(numbers) {
  let figureSetting = figure[numbers];
  let x = startPosX;
  let y = startPosY;

  for (let index = 0; index < figureSetting[0].length; index++) {
    x += figureSetting[0][index];
    y += figureSetting[1][index];
    let fig = document.querySelector(`[posX= "${x}"][posy= "${y}"]`);
    fig.classList.add("fill");
  }
  startPosY += 1;
}

function resetOldPosition() {
  document.querySelectorAll(".fill").forEach((element) => {
    element.classList.remove("fill");
  });
}

function clearWindow() {
  document.querySelectorAll(".moved").forEach((element) => {
    element.classList.remove("moved");
  });
}

function saveResult(key_local) {
  let savedData = JSON.parse(localStorage.getItem(key_local));
  if (savedData !== null) {
    scoreData = savedData.sort(function(a, b) {
      return a - b;
    });
    if ( scoreData[scoreData.length - 1] < points &&   scoreData.length > 10 &&   points > 0 ) {
      scoreData.push(points);
      scoreData.shift();
    }
    else if (scoreData.length < 10 && points > 0) {
      scoreData.push(points);
    }

    localStorage.removeItem(key_local);
    localStorage.setItem(key_local, JSON.stringify(scoreData));
  } else {
    scoreData.push(points);
    localStorage.setItem(key_local, JSON.stringify(scoreData));
  }
}

function getResult(key) {
  return JSON.parse(localStorage.getItem(key));
}

function finishGame() {
  document.querySelector(".story").innerHTML = ` `;
  document.querySelector(".result").innerHTML = `Game over`;
  document.querySelector(".score").innerHTML = `Your score: ${points}`;
  document.querySelector(`.title`).innerHTML = "";
  document.querySelector(".result_game").classList.add("active");
  points = 0;
}

function pauseGame() {
  if (play_btn.classList.contains("pause")) {
    play_btn.classList.remove("pause");
    play_btn.classList.add("start");
    clearInterval(timer);
  } else {
    play_btn.classList.remove("start");
    play_btn.classList.add("pause");
    timer = setInterval(() => {
      moveFigure(figureNumber);
    }, intervalTimes);
  }
}

function showBestResults() {
  // if (!document.querySelector(".result_game").classList.contains("active")) {
  if (!timer) {
    pauseGame();
  }

  document.querySelector(".story").innerHTML = ` `;
  document.querySelector(".result").innerHTML = ` `;
  document.querySelector(".score").innerHTML = ` `;
  let parent = document.querySelector(".story");
  parent.append(
    (document.createElement("h4").textContent = "Top 10 best results:")
  );
  let index = 1;
  let arrayResult = getResult(result_key).sort(function(a, b) {
    return a - b;
  });

  for (let iterator of arrayResult.reverse()) {
    let pElem = document.createElement("p");
    pElem.textContent = `№${index++} - result ${iterator}`;
    parent.append(pElem);
  }

  document.querySelector(".result_game").classList.toggle("active");
  points = 0;
  // } else {
  //   pauseGame();
  //   document.querySelector(".result_game").classList.remove("active");
  // }
}
///function for moving the current figure, where check of end window (position Y), clear previus state of the figure,
/// settup new figure into window.  if  figure moved bottom or first state figure, they stop and get .moved class
function moveFigure(numbers) {
  checkForStopFigure();
  if (!isGameOver) {
    resetOldPosition();
    if (!isBottom) {
      createFigure(numbers);
    }

    if (startPosY === bottomPositionEnd || isBottom) {
      document.querySelectorAll(".fill").forEach((e) => {
        e.classList.add("moved");
        e.classList.remove("fill");
      });

      clearInterval(timer);
      start(setRandomFigure());
    }
  }
}

/////start tetris function, where settup the first/main variable -- position X and Y coordinates
//// and settup timer for start function  each time
////////////////////////////////////////////////////////////////////////////////////////////////
function start(numbers) {
  isBottom = false;
  isGameOver = false;
  startPosX = 4;
  startPosY = 2;
  timer = setInterval(() => {
    moveFigure(numbers);
  }, intervalTimes);
}

//// create a game window and start tetris///////
////////////////////////////////////////////////
createScreen();
start(figureNumber);

/////////listners////////////////
//////////////////////////////////

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") {
    if (startPosX < 9 && isFreeRightSide) {
      startPosX += 1;
    }
  }
  if (e.code === "ArrowLeft") {
    if (isFreeSide("left")) {
      startPosX -= 1;
    }
  }
});

left_btn.addEventListener("click", () => {
  if (isFreeSide("left")) {
    startPosX -= 1;
  }
});

right_btn.addEventListener("click", () => {
  if (isFreeSide("right") && isFreeRightSide) {
    startPosX += 1;
  }
});

restart.addEventListener("click", () => {
  isGameOver = true;
  isBottom = false;
  clearInterval(timer);
  document.querySelector(".result_game").classList.remove("active");
  resetOldPosition();
  clearWindow();
  start(setRandomFigure());
});

play_btn.addEventListener("click", pauseGame);

result_story_btn.addEventListener("click", showBestResults);
