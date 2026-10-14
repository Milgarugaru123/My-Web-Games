import { holdCase, tetrisScreen, nextCase, furtherNextCase } from "./query.js";
import {
  minoDatas,
  makeMino,
  gridDatas,
  minoBag,
  refillBag,
} from "./mino_datas.js";

const keyDatas = {
  spinLeft: `s`,
  spinRight: `d`,
  hold: `Shift`,
};

export const gameData = {
  isPlaying: false,
  highscore: 0,
  score: 0,
  gameSpeed: 0,
  initGameSpeed: 1000,
  curMino: undefined,
  minoPos: {
    spinPos: undefined,
    rend1: undefined,
    rend2: undefined,
    rend3: undefined,
  },
  minoSpin: 0, // 0 : default, 1 : 90deg, 2 : 180deg, 3: 270deg
  holdMino: undefined,
  holdDone: false,
  bottomDelay: 0,
  minoIntervalID: undefined,
};
export const gameGridData = new Array(24).fill(0).map((row) => {
  return Array(10)
    .fill(0)
    .map((grid) => {
      return { mino: undefined, isMoving: false };
    });
});

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

const rendBoard = () => {
  if (!gameData.isPlaying) return;
  Array(20)
    .fill(0)
    .forEach((x, row) => {
      Array(10)
        .fill(0)
        .forEach((y, grid) => {
          gridDatas[row][grid].classList.remove(minoDatas[0].color);
          gridDatas[row][grid].classList.remove(minoDatas[1].color);
          gridDatas[row][grid].classList.remove(minoDatas[2].color);
          gridDatas[row][grid].classList.remove(minoDatas[3].color);
          gridDatas[row][grid].classList.remove(minoDatas[4].color);
          gridDatas[row][grid].classList.remove(minoDatas[5].color);
          gridDatas[row][grid].classList.remove(minoDatas[6].color);
          switch (gameGridData[row + 4][grid].mino) {
            case minoDatas[0].name:
              gridDatas[row][grid].classList.add(minoDatas[0].color);
              break;

            case minoDatas[1].name:
              gridDatas[row][grid].classList.add(minoDatas[1].color);
              break;

            case minoDatas[2].name:
              gridDatas[row][grid].classList.add(minoDatas[2].color);
              break;

            case minoDatas[3].name:
              gridDatas[row][grid].classList.add(minoDatas[3].color);
              break;

            case minoDatas[4].name:
              gridDatas[row][grid].classList.add(minoDatas[4].color);
              break;

            case minoDatas[5].name:
              gridDatas[row][grid].classList.add(minoDatas[5].color);
              break;

            case minoDatas[6].name:
              gridDatas[row][grid].classList.add(minoDatas[6].color);
              break;

            default:
              break;
          }
        });
    });
};

const minoOffGrid = (row, grid) => {
  gameGridData[row + 4][grid].mino = undefined;
  gameGridData[row + 4][grid].isMoving = false;
};

const minoRemovePrev = () => {
  if (!gameData.minoPos.spinPos) return;
  minoOffGrid(gameData.minoPos.spinPos.row, gameData.minoPos.spinPos.grid);
  minoOffGrid(gameData.minoPos.rend1.row, gameData.minoPos.rend1.grid);
  minoOffGrid(gameData.minoPos.rend2.row, gameData.minoPos.rend2.grid);
  minoOffGrid(gameData.minoPos.rend3.row, gameData.minoPos.rend3.grid);
};

const minoOnGrid = (row, grid) => {
  gameGridData[row + 4][grid].mino = gameData.curMino;
  gameGridData[row + 4][grid].isMoving = true;
};

const rendMino = () => {
  minoOnGrid(gameData.minoPos.spinPos.row, gameData.minoPos.spinPos.grid);
  minoOnGrid(gameData.minoPos.rend1.row, gameData.minoPos.rend1.grid);
  minoOnGrid(gameData.minoPos.rend2.row, gameData.minoPos.rend2.grid);
  minoOnGrid(gameData.minoPos.rend3.row, gameData.minoPos.rend3.grid);
  rendBoard();
};

const setMinoRendGrids = () => {
  const spinPos = gameData.minoPos.spinPos;
  switch (gameData.curMino) {
    case minoDatas[0].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 1,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 2,
      };
      break;

    case minoDatas[1].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid + 1,
      };
      break;

    case minoDatas[2].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid + 1,
      };
      break;

    case minoDatas[3].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 1,
      };
      break;

    case minoDatas[4].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 1,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid + 1,
      };
      break;

    case minoDatas[5].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row,
        grid: +spinPos.grid + 1,
      };
      break;

    case minoDatas[6].name:
      gameData.minoPos.rend1 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: +spinPos.row - 1,
        grid: +spinPos.grid + 1,
      };
      break;

    default:
      break;
  }
};

/* 미노 회전축 스폰 위치 기준점 = gridDatas[0][4] (gameGridData[4][4]) */
/* gameGridData = { mino: undefined, isMoving: false } */
const minoSpawn = () => {
  minoRemovePrev();
  gameData.minoPos.spinPos = { row: 0, grid: 4 };
  setMinoRendGrids();
  rendMino();
};

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
    minoSpawn();
  }
  rendHold();
  console.log(gameData);
};

export const minoDrop = () => {};

const keyPressDown = () => {
  if (gameData.minoPos.spinPos.row >= 19) return;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row + 1,
    grid: gameData.minoPos.spinPos.grid,
  };
  setMinoRendGrids();
  rendMino();
};
const keyPressLeft = () => {
  if (gameData.minoPos.spinPos.grid <= 0) return;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid - 1,
  };
  setMinoRendGrids();
  rendMino();
};
const keyPressRight = () => {
  if (gameData.minoPos.spinPos.grid >= 9) return;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid + 1,
  };
  setMinoRendGrids();
  rendMino();
};
const keyPressSpacebar = () => {};

const spinLeft = () => {
  minoRemovePrev();
  gameData.minoPos.minoSpin =
    gameData.minoPos.minoSpin === 0 ? 3 : gameData.minoPos.minoSpin - 1;
  setMinoRendGrids();
  rendMino();
};
const spinRight = () => {
  minoRemovePrev();
  gameData.minoPos.minoSpin =
    gameData.minoPos.minoSpin === 3 ? 0 : gameData.minoPos.minoSpin + 1;
  setMinoRendGrids();
  rendMino();
};

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
