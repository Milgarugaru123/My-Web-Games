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
        row: spinPos.row,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row,
        grid: spinPos.grid + 1,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row,
        grid: spinPos.grid + 2,
      };
      break;

    case minoDatas[1].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row,
        grid: spinPos.grid + 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row - 1,
        grid: spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row - 1,
        grid: spinPos.grid + 1,
      };
      break;

    case minoDatas[2].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row - 1,
        grid: spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row - 1,
        grid: spinPos.grid + 1,
      };
      break;

    case minoDatas[3].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row - 1,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row - 1,
        grid: spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row,
        grid: spinPos.grid + 1,
      };
      break;

    case minoDatas[4].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row,
        grid: spinPos.grid + 1,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row - 1,
        grid: spinPos.grid + 1,
      };
      break;

    case minoDatas[5].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row - 1,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row,
        grid: spinPos.grid + 1,
      };
      break;

    case minoDatas[6].name:
      gameData.minoPos.rend1 = {
        row: spinPos.row - 1,
        grid: spinPos.grid - 1,
      };
      gameData.minoPos.rend2 = {
        row: spinPos.row - 1,
        grid: spinPos.grid,
      };
      gameData.minoPos.rend3 = {
        row: spinPos.row - 1,
        grid: spinPos.grid + 1,
      };
      break;

    default:
      break;
  }
};

const gameOver = () => {
  window.alert(`Game Over!`);
};

const checkGridConflict = (row, grid) => {
  if (gameGridData[row + 4][grid].isMoving) return false;
  if (gameGridData[row + 4][grid].mino) return true;
  return false;
};

const checkMoveConflict = (move = `stop`) => {
  const spinPos = gameData.minoPos.spinPos;
  const pos1 = gameData.minoPos.rend1;
  const pos2 = gameData.minoPos.rend2;
  const pos3 = gameData.minoPos.rend3;
  switch (move) {
    case `stop`:
      return (
        checkGridConflict(spinPos.row, spinPos.grid) ||
        checkGridConflict(pos1.row, pos1.grid) ||
        checkGridConflict(pos2.row, pos2.grid) ||
        checkGridConflict(pos3.row, pos3.grid)
      );

    case `left`:
      return (
        spinPos.grid < 1 ||
        pos1.grid < 1 ||
        pos2.grid < 1 ||
        pos3.grid < 1 ||
        checkGridConflict(spinPos.row, spinPos.grid - 1) ||
        checkGridConflict(pos1.row, pos1.grid - 1) ||
        checkGridConflict(pos2.row, pos2.grid - 1) ||
        checkGridConflict(pos3.row, pos3.grid - 1)
      );

    case `right`:
      return (
        spinPos.grid > 8 ||
        pos1.grid > 8 ||
        pos2.grid > 8 ||
        pos3.grid > 8 ||
        checkGridConflict(spinPos.row, spinPos.grid + 1) ||
        checkGridConflict(pos1.row, pos1.grid + 1) ||
        checkGridConflict(pos2.row, pos2.grid + 1) ||
        checkGridConflict(pos3.row, pos3.grid + 1)
      );

    case `down`:
      return (
        spinPos.row > 18 ||
        pos1.row > 18 ||
        pos2.row > 18 ||
        pos3.row > 18 ||
        checkGridConflict(spinPos.row + 1, spinPos.grid) ||
        checkGridConflict(pos1.row + 1, pos1.grid) ||
        checkGridConflict(pos2.row + 1, pos2.grid) ||
        checkGridConflict(pos3.row + 1, pos3.grid)
      );

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
  if (checkMoveConflict()) gameOver();
  rendMino();
};

export const takeoutNext = () => {
  refillBag();
  gameData.curMino = minoBag.shift();
  gameData.holdDone = false;
  minoSpawn();
  rendNext();
};

const checkHoldConflict = (mino) => {
  const tempMino = {
    pos: { row: 0, grid: 4 },
    rend1: undefined,
    rend2: undefined,
    rend3: undefined,
  };
  switch (mino) {
    case minoDatas[0].name:
      tempMino.rend1 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 2,
      };
      break;

    case minoDatas[1].name:
      tempMino.rend1 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid + 1,
      };
      break;

    case minoDatas[2].name:
      tempMino.rend1 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid + 1,
      };
      break;

    case minoDatas[3].name:
      tempMino.rend1 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      break;

    case minoDatas[4].name:
      tempMino.rend1 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid + 1,
      };
      break;

    case minoDatas[5].name:
      tempMino.rend1 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      break;

    case minoDatas[6].name:
      tempMino.rend1 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row - 1,
        grid: tempMino.pos.grid + 1,
      };
      break;

    default:
      break;
  }
  return (
    checkGridConflict(tempMino.pos.row, tempMino.pos.grid) ||
    checkGridConflict(tempMino.rend1.row, tempMino.rend1.grid) ||
    checkGridConflict(tempMino.rend2.row, tempMino.rend2.grid) ||
    checkGridConflict(tempMino.rend3.row, tempMino.rend3.grid)
  );
};

const changeHold = () => {
  if (gameData.holdDone) return;
  if (!gameData.holdMino) {
    if (checkHoldConflict(minoBag[0])) return;
    gameData.holdDone = true;
    gameData.holdMino = gameData.curMino;
    takeoutNext();
  } else {
    if (checkHoldConflict(gameData.holdMino)) return;
    gameData.holdDone = true;
    const tempMino = gameData.holdMino;
    gameData.holdMino = gameData.curMino;
    gameData.curMino = tempMino;
    minoSpawn();
  }
  rendHold();
};

const keyPressDown = () => {
  if (checkMoveConflict(`down`)) return true;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row + 1,
    grid: gameData.minoPos.spinPos.grid,
  };
  setMinoRendGrids();
  rendMino();
  return false;
};
const keyPressLeft = () => {
  if (checkMoveConflict(`left`)) return;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid - 1,
  };
  setMinoRendGrids();
  rendMino();
};
const keyPressRight = () => {
  if (checkMoveConflict(`right`)) return;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid + 1,
  };
  setMinoRendGrids();
  rendMino();
};

const minoDrop = () => {
  const isBottom = keyPressDown();
  if (isBottom) return;
  else minoDrop();
};
const keyPressSpacebar = () => {
  minoDrop();
  gameGridData[gameData.minoPos.spinPos.row][
    gameData.minoPos.spinPos.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend1.row][
    gameData.minoPos.rend1.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend2.row][
    gameData.minoPos.rend2.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend3.row][
    gameData.minoPos.rend3.grid
  ].isMoving = false;
  gameData.minoPos.spinPos = undefined;
  takeoutNext();
};

const spinLeft = () => {
  minoRemovePrev();
  gameData.minoSpin = gameData.minoSpin === 0 ? 3 : gameData.minoSpin - 1;
  setMinoRendGrids();
  rendMino();
};
const spinRight = () => {
  minoRemovePrev();
  gameData.minoSpin = gameData.minoSpin === 3 ? 0 : gameData.minoSpin + 1;
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
);
