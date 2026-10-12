import { holdCase, tetrisScreen, nextCase, furtherNextCase } from "./query.js";
import {
  minoDatas,
  makeMino,
  gridDatas,
  minoBag,
  refillBag,
} from "./mino_datas.js";

export const gameData = {
  isPlaying: false,
  highscore: 0,
  score: 0,
  timer: 0,
  curMino: undefined,
  minoPos: undefined,
  minoSpin: 0, // 0 : default, 1 : 90deg, 2 : 180deg, 3: 270deg
  holdMino: undefined,
  holdDone: false,
  bottomDelay: 0,
  minoIntervalID: undefined,
};
export const gameGridData = new Array(20).fill(0).map((row) => {
  return Array(10)
    .fill(0)
    .map((grid) => {
      return { mino: undefined, isMoving: false };
    });
});

const keyDatas = {
  spinLeft: `s`,
  spinRight: `d`,
  hold: `Shift`,
};

export const rendNext = () => {
  nextCase.innerHTML = ``;
  furtherNextCase.innerHTML = ``;
  nextCase.appendChild(makeMino(minoBag[0]));
  Array(4)
    .fill(0)
    .forEach((x, i) => {
      const furtherNextMino = document.createElement(`div`);
      furtherNextMino.classList.add(`further_next_mino`);
      furtherNextCase.appendChild(furtherNextMino);
      furtherNextMino.appendChild(makeMino(minoBag[i + 1]));
    });
};

export const rendHold = () => {
  if (!gameData.holdMino) {
    holdCase.innerHTML = `━━━`;
    return;
  }
  holdCase.innerHTML = ``;
  holdCase.appendChild(makeMino(gameData.holdMino));
};

/* 미노 회전축 스폰 위치 기준점 = gridDatas[0][4] */
const minoSpawn = () => {};

export const takeoutNext = () => {
  refillBag();
  gameData.curMino = minoBag.shift();
  gameData.holdDone = false;
  minoSpawn();
  rendNext();
};

const changeHold = () => {
  if (gameData.holdDone) return;
  gameData.holdDone = true;
  if (!gameData.holdMino) {
    gameData.holdMino = gameData.curMino;
    takeoutNext();
  } else {
    const tempMino = gameData.holdMino;
    gameData.holdMino = gameData.curMino;
    gameData.curMino = tempMino;
  }
  rendHold();
  console.log(gameData);
};

export const minoDrop = () => {};

const keyPressDown = () => {};
const keyPressLeft = () => {};
const keyPressRight = () => {};
const keyPressSpacebar = () => {};

const spinLeft = () => {};
const spinRight = () => {};

document.addEventListener(`keydown`, (e) => {
  // console.log(e.keyCode);
  if (!gameData.isPlaying && e.key !== `F12`) {
    e.preventDefault();
    return;
  }

  /* e.keyCode 로 바꿀 가능성 있음 */
  switch (e.key) {
    case `Down`: // IE/Edge에서 사용되는 값
    case `ArrowDown`:
      console.log(e.key);
      keyPressDown();
      break;

    case `Left`: // IE/Edge에서 사용되는 값
    case `ArrowLeft`:
      console.log(e.key);
      keyPressLeft();
      break;

    case `Right`: // IE/Edge에서 사용되는 값
    case `ArrowRight`:
      console.log(e.key);
      keyPressRight();
      break;

    case `Spacebar`: // 옛날 브라우저가 리턴할 가능성 있음
    case ` `:
      console.log(e.key);
      keyPressSpacebar();
      break;

    case keyDatas.spinLeft:
      console.log(e.key);
      spinLeft();
      break;

    case keyDatas.spinRight:
      console.log(e.key);
      spinRight();
      break;

    case keyDatas.hold:
      console.log(e.key);
      changeHold();
      break;

    case `F12`:
      break;

    default:
      e.preventDefault();
      break;
  }
});

console.log(
  // rendNext,
  // rendHold,
  gameData,
  gameGridData,
  // takeoutNext,
  // minoDrop
);
