import { holdCase, tetrisScreen, nextCase, furtherNextCase } from "./query.js";
import {
  minoDatas,
  makeMino,
  gridDatas,
  minoBag,
  refillBag,
} from "./mino_datas.js";
import {
  rendNext,
  rendHold,
  gameData,
  gameGridData,
  takeoutNext,
  minoDrop,
} from "./game.js";
import "./query.js";
import "./mino_datas.js";
import "./game.js";

const gamePreview = () => {
  refillBag();
  rendNext();
  rendHold();
};

const gameStart = () => {
  takeoutNext();
  rendHold();
  console.log(gameData);
};

const countDown = (count) => {
  if (count > 0) {
    const num = document.createElement(`div`);
    num.classList.add(`count_down_num`);
    num.innerHTML = `${count}`;
    document.body.appendChild(num);
    setTimeout(() => {
      num.classList.add(`count_down_animation`);
    }, 50);
    setTimeout(() => {
      document.body.removeChild(num);
      countDown(count - 1);
    }, 1000);
  } else {
    setTimeout(() => {
      gameData.isPlaying = true;
      gameStart();
    }, 10);
  }
};

const gameReady = () => {
  gamePreview();
  countDown(3);
};

/* init */

const startBtn = document.createElement(`button`);
startBtn.innerHTML = `Tetris To Start!`;
startBtn.classList.add(`start_btn`);
document.body.appendChild(startBtn);

startBtn.addEventListener(`click`, () => {
  document.body.removeChild(startBtn);
  gameReady();
});

console.log(gridDatas[0][0]); // 왼쪽 위
console.log(gridDatas[19][9]); // 오른쪽 아래
