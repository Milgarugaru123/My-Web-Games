import {
  holdCase,
  tetrisScreen,
  nextCase,
  furtherNextCase,
  curScore,
  highScore,
  spinReview,
  restartBtn,
} from "./query.js";
import {
  minoDatas,
  makeMino,
  gridDatas,
  minoBag,
  refillBag,
} from "./mino_datas.js";
import {
  scoreData,
  rendScore,
  softDropScore,
  hardDropScore,
  lineClearScore,
} from "./score_system.js";

const keyDatas = {
  leftPressed: false,
  rightPressed: false,
  downPressed: false,
  dropPressed: false,
  spinLeft: `s`,
  spinLeftPressed: false,
  spinRight: `d`,
  spinRightPressed: false,
  hold: `Shift`,
  holdPressed: false,
};
const intervalId = {
  leftKey: undefined,
  rightKey: undefined,
  downKey: undefined,
  minoFall: undefined,
};
export const gameData = {
  isPlaying: false,
  highscore: 0,
  score: 0,
  initGameSpeed: 1500,
  curBgm: undefined,
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
  isSpinned: false,
  minoDownInterval: 30, // init: 30~50
  minoSideMoveInterval: 80, // init: 70~80
  bottomDelay: 0,
  maxBottomDelay: 10,
};
export const gameGridData = new Array(24).fill(0).map((row) => {
  return Array(10)
    .fill(0)
    .map((grid) => {
      return { mino: undefined, isMoving: false };
    });
});

const minoFall = () => {
  if (!gameData.isPlaying) return;
  gameData.isSpinned = false;
  const scoreLen = [...(`` + Math.floor(gameData.score / 100))].length;
  const balance = 5; // 난이도 별 속도 조절용
  const alpha =
    ((scoreLen < 2 ? 0 : (scoreLen - 1) ** 2) * 10 +
      Math.floor(gameData.score / 10 ** (scoreLen < 2 ? 2 : scoreLen + 1)) *
        (scoreLen * 2 - 1)) *
    balance;
  if (
    gameData.initGameSpeed - alpha < gameData.minoDownInterval &&
    !scoreData.maxedScoreLen
  )
    scoreData.maxedScoreLen = scoreLen;
  const interval =
    gameData.initGameSpeed - alpha < gameData.minoDownInterval
      ? Math.max(
          gameData.minoDownInterval -
            (scoreLen - scoreData.maxedScoreLen) * balance,
          10,
        )
      : gameData.initGameSpeed - alpha;
  intervalId.minoFall = setTimeout(() => {
    if (keyDatas.downPressed) {
      if (checkMoveConflict(`down`)) gameData.bottomDelay += 1;
      console.log(gameData.bottomDelay);
      if (gameData.bottomDelay < Math.ceil(gameData.maxBottomDelay / 4))
        minoFall();
      else if (
        gameData.bottomDelay < Math.ceil(gameData.maxBottomDelay / 2) &&
        (gameData.isSpinned || keyDatas.leftPressed || keyDatas.rightPressed)
      )
        minoFall();
      else if (
        gameData.bottomDelay < gameData.maxBottomDelay &&
        gameData.isSpinned
      )
        minoFall();
      else {
        fixCurMino();
        takeoutNext();
      }
    } else {
      const isConflict = keyPressDown();
      if (isConflict) gameData.bottomDelay += 1;
      else if (gameData.bottomDelay > 0) gameData.bottomDelay += 0.5;
      console.log(gameData.bottomDelay);
      if (gameData.bottomDelay < Math.ceil(gameData.maxBottomDelay / 4))
        minoFall();
      else if (
        gameData.bottomDelay < Math.ceil(gameData.maxBottomDelay / 2) &&
        (gameData.isSpinned || keyDatas.leftPressed || keyDatas.rightPressed)
      )
        minoFall();
      else if (
        gameData.bottomDelay < gameData.maxBottomDelay &&
        gameData.isSpinned
      )
        minoFall();
      else {
        fixCurMino();
        takeoutNext();
      }
    }
  }, interval);
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
          if (gameData.isPlaying) {
            const gridBorder = [
              ...gridDatas[row][grid].querySelectorAll(`.grid_border`),
            ];
            Array(gridBorder.length)
              .fill(0)
              .forEach((x, i) => {
                gridBorder[i].classList.remove(`grid_border_hidden`);
                if (gameGridData[row + 4][grid].mino)
                  gridBorder[i].classList.add(`grid_border_hidden`);
              });
          }
        });
    });
};

const fixCurMino = () => {
  gameGridData[gameData.minoPos.spinPos.row + 4][
    gameData.minoPos.spinPos.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend1.row + 4][
    gameData.minoPos.rend1.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend2.row + 4][
    gameData.minoPos.rend2.grid
  ].isMoving = false;
  gameGridData[gameData.minoPos.rend3.row + 4][
    gameData.minoPos.rend3.grid
  ].isMoving = false;
  gameData.minoPos.spinPos = undefined;
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
  switch (gameData.minoSpin) {
    case 0:
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
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          break;

        default:
          break;
      }
      break;

    case 1:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 2,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[2].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid + 1,
          };
          break;

        case minoDatas[3].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[4].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid + 1,
          };
          break;

        case minoDatas[5].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row - 1,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[6].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        default:
          break;
      }
      break;

    case 2:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row,
            grid: spinPos.grid - 2,
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

        case minoDatas[2].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[3].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid + 1,
          };
          break;

        case minoDatas[4].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          break;

        case minoDatas[5].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid + 1,
          };
          break;

        case minoDatas[6].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
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

        default:
          break;
      }
      break;

    case 3:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 2,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[2].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[3].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid - 1,
          };
          break;

        case minoDatas[4].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[5].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row + 1,
            grid: spinPos.grid - 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        case minoDatas[6].name:
          gameData.minoPos.rend1 = {
            row: spinPos.row - 1,
            grid: spinPos.grid,
          };
          gameData.minoPos.rend2 = {
            row: spinPos.row,
            grid: spinPos.grid + 1,
          };
          gameData.minoPos.rend3 = {
            row: spinPos.row + 1,
            grid: spinPos.grid,
          };
          break;

        default:
          break;
      }
      break;
  }
};

const gameOver = () => {
  gameData.isPlaying = false;
  window.alert(`Game Over!`);
  toggleRestartBtn();
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
      if (
        checkGridConflict(spinPos.row, spinPos.grid) ||
        checkGridConflict(pos1.row, pos1.grid) ||
        checkGridConflict(pos2.row, pos2.grid) ||
        checkGridConflict(pos3.row, pos3.grid)
      ) {
        if (
          checkGridConflict(spinPos.row - 1, spinPos.grid) ||
          checkGridConflict(pos1.row - 1, pos1.grid) ||
          checkGridConflict(pos2.row - 1, pos2.grid) ||
          checkGridConflict(pos3.row - 1, pos3.grid)
        )
          return true;
        else return `up`;
      }
      return false;

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

/* 완성된 줄 지우기 */
const checkRowComplete = () => {
  scoreData.lineCleared = 0;
  const gridFilled = Array(24)
    .fill(0)
    .map((x, row) => {
      const rowFilled = Array(10)
        .fill(0)
        .map((y, grid) => {
          if (gameGridData[row][grid].mino) return 1;
          return 0;
        })
        .reduce((a, b) => a + b);
      if (rowFilled === 10) {
        scoreData.lineCleared += 1;
        if (row >= 4) {
          Array(10)
            .fill(0)
            .forEach((y, grid) => {
              minoOffGrid(row - 4, grid);
            });
        }
        Array(row)
          .fill(0)
          .forEach((x2, row2) => {
            Array(10)
              .fill(0)
              .forEach((y2, grid2) => {
                gameGridData[row - row2][grid2] = {
                  mino: gameGridData[row - row2 - 1][grid2].mino,
                  isMoving: gameGridData[row - row2 - 1][grid2].isMoving,
                };
              });
          });
        Array(10)
          .fill(0)
          .forEach((y, grid) => {
            gameGridData[0][grid] = { mino: undefined, isMoving: undefined };
          });
      }
      return rowFilled;
    })
    .reduce((x, y) => x + y);
  console.log(
    scoreData.isT_Spin
      ? scoreData.isT_Spin == `mini`
        ? `T Spin mini!`
        : `T SPIN!`
      : ``,
  );
  if (scoreData.lineCleared > 0) {
    scoreData.combo += 1;
    if (scoreData.lineCleared === 4 || scoreData.isT_Spin)
      scoreData.isBTB = true;
    else scoreData.isBTB = false;
    lineClearScore(!(gridFilled - scoreData.lineCleared * 10));
  } else scoreData.combo = 0;
  scoreData.tempScore = gameData.score;
  scoreData.isT_Spin = false;
  bgmCrossFade(3000);
};

const minoSpawn = () => {
  minoRemovePrev();
  gameData.minoPos.spinPos = { row: 0, grid: 4 };
  if (gameData.curMino == minoDatas[6].name)
    gameData.minoPos.spinPos = { row: -1, grid: 4 };
  gameData.minoSpin = 0;
  gameData.isSpinned = false;
  gameData.bottomDelay = 0;
  setMinoRendGrids();
  const checkConflict = checkMoveConflict();
  if (checkConflict) {
    if (checkConflict == `up`) {
      gameData.minoPos.spinPos.row -= 1;
      setMinoRendGrids();
    } else gameOver();
  }
  rendMino();
};

/* 미노 회전축 스폰 위치 기준점 = gridDatas[0][4] (gameGridData[4][4]) */
export const takeoutNext = () => {
  clearTimeout(intervalId.minoFall);
  checkRowComplete();
  refillBag();
  gameData.curMino = minoBag.shift();
  gameData.holdDone = false;
  minoSpawn();
  minoFall();
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
      tempMino.pos.row = -1;
      tempMino.rend1 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid - 1,
      };
      tempMino.rend2 = {
        row: tempMino.pos.row + 1,
        grid: tempMino.pos.grid,
      };
      tempMino.rend3 = {
        row: tempMino.pos.row,
        grid: tempMino.pos.grid + 1,
      };
      break;

    default:
      return;
  }
  if (
    checkGridConflict(tempMino.pos.row, tempMino.pos.grid) ||
    checkGridConflict(tempMino.rend1.row, tempMino.rend1.grid) ||
    checkGridConflict(tempMino.rend2.row, tempMino.rend2.grid) ||
    checkGridConflict(tempMino.rend3.row, tempMino.rend3.grid)
  ) {
    return (
      checkGridConflict(tempMino.pos.row - 1, tempMino.pos.grid) ||
      checkGridConflict(tempMino.rend1.row - 1, tempMino.rend1.grid) ||
      checkGridConflict(tempMino.rend2.row - 1, tempMino.rend2.grid) ||
      checkGridConflict(tempMino.rend3.row - 1, tempMino.rend3.grid)
    );
  }
  return false;
};

const changeHold = () => {
  if (gameData.holdDone) return;
  scoreData.isT_Spin = false;
  gameData.score = scoreData.tempScore;
  rendScore();
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
  scoreData.isT_Spin = false;
  if (keyDatas.downPressed) softDropScore();
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
  scoreData.isT_Spin = false;
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
  scoreData.isT_Spin = false;
  minoRemovePrev();
  gameData.minoPos.spinPos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid + 1,
  };
  setMinoRendGrids();
  rendMino();
};

const minoDrop = (height) => {
  const isBottom = keyPressDown();
  if (isBottom) return height;
  else return minoDrop(height + 1);
};
const keyPressSpacebar = () => {
  const mino_height = minoDrop(0);
  hardDropScore(mino_height);
  fixCurMino();
  takeoutNext();
};

const checkSpinOutOfBoard = (pos, pos1, pos2, pos3) => {
  return (
    pos.row < -4 ||
    pos1.row < -4 ||
    pos2.row < -4 ||
    pos3.row < -4 ||
    pos.row > 19 ||
    pos1.row > 19 ||
    pos2.row > 19 ||
    pos3.row > 19 ||
    pos.grid < 0 ||
    pos1.grid < 0 ||
    pos2.grid < 0 ||
    pos3.grid < 0 ||
    pos.grid > 9 ||
    pos1.grid > 9 ||
    pos2.grid > 9 ||
    pos3.grid > 9
  );
};

const setI_MinoSpinned = (pos, pos1, pos2, pos3) => {
  minoRemovePrev();
  gameData.minoPos.spinPos = pos;
  gameData.minoPos.rend1 = pos1;
  gameData.minoPos.rend2 = pos2;
  gameData.minoPos.rend3 = pos3;
  return 1;
};

/* 스핀 시 미노 이동 우선순위 (spinPos 기준) (I, O 미노 제외):
1. 본래 위치
2. 스핀 방향 앞 같은 높이
3~5. 한 칸 아래 (스핀 방향 -> 반대 방향)
6~8. 두 칸 아래 (스핀 방향 -> 반대 방향)
9. 스핀 반대 방향 같은 높이
10~12. 한 칸 위 (직상, 스핀 방향, 반대 방향)
-> 총 12 케이스
*/

/* T 스핀 스페셜 (기본 우선순위에서 약간 변형됨):
1. 본래 위치
2~3. 같은 높이 (반대 방향 -> 스핀 방향)
4~6. 한 칸 아래 (스핀 방향 -> 반대 방향)
7~9. 두 칸 아래 (스핀 방향 -> 반대 방향)
10~12. 한 칸 위 (직상, 스핀 방향, 반대 방향)
*/

/* 스핀 시 미노 이동 우선순위 (spinPos) (I 미노 전용):
1. [스핀 시프트 후] 본래 위치
<가로 방향>
2. 스핀 시프트 대각 반전 위치
[기준점을 row가 높은 쪽으로 고정]
3~4. 한 칸 아래 (스핀 방향, 반대 방향 * 2)
5. 두 칸 아래 스핀 방향
6. 한 칸 위 반대 방향 * 2
<세로 방향>
[기준점 변경된 상태]
2~3. 두 칸 아래 (반대 방향, 직강)
4. 스핀 시프트 대각 반전 위치 [기준점 미적용]
5~6. 한 칸 위 (스핀 방향 * 2, 직상)
-> 총 2(공통) + 4(가로) + 4(세로) = 10 케이스
*/
const checkSpinI_MinoConflict = (pos, pos1, pos2, pos3, lr, spin) => {
  if (
    !(
      checkSpinOutOfBoard(pos, pos1, pos2, pos3) ||
      checkGridConflict(pos.row, pos.grid) ||
      checkGridConflict(pos1.row, pos1.grid) ||
      checkGridConflict(pos2.row, pos2.grid) ||
      checkGridConflict(pos3.row, pos3.grid)
    )
  )
    return setI_MinoSpinned(pos, pos1, pos2, pos3);
  const posAlt = {
    row: spin === 0 || gameData.minoSpin === 2 ? pos.row + 1 : pos.row - 1,
    grid: spin === 1 || gameData.minoSpin === 3 ? pos.grid - 1 : pos.grid + 1,
  };
  const pos1Alt = {
    row: spin === 0 || gameData.minoSpin === 2 ? pos1.row + 1 : pos1.row - 1,
    grid: spin === 1 || gameData.minoSpin === 3 ? pos1.grid - 1 : pos1.grid + 1,
  };
  const pos2Alt = {
    row: spin === 0 || gameData.minoSpin === 2 ? pos2.row + 1 : pos2.row - 1,
    grid: spin === 1 || gameData.minoSpin === 3 ? pos2.grid - 1 : pos2.grid + 1,
  };
  const pos3Alt = {
    row: spin === 0 || gameData.minoSpin === 2 ? pos3.row + 1 : pos3.row - 1,
    grid: spin === 1 || gameData.minoSpin === 3 ? pos3.grid - 1 : pos3.grid + 1,
  };
  if (pos.row > posAlt.row) {
    pos = posAlt;
    pos1 = pos1Alt;
    pos2 = pos2Alt;
    pos3 = pos3Alt;
  }
  switch (spin) {
    case 0:
    case 2:
      if (
        !(
          checkSpinOutOfBoard(posAlt, pos1Alt, pos2Alt, pos3Alt) ||
          checkGridConflict(posAlt.row, posAlt.grid) ||
          checkGridConflict(pos1Alt.row, pos1Alt.grid) ||
          checkGridConflict(pos2Alt.row, pos2Alt.grid) ||
          checkGridConflict(pos3Alt.row, pos3Alt.grid)
        )
      )
        return setI_MinoSpinned(posAlt, pos1Alt, pos2Alt, pos3Alt);
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row + 1, grid: pos.grid + lr },
            { row: pos1.row + 1, grid: pos1.grid + lr },
            { row: pos2.row + 1, grid: pos2.grid + lr },
            { row: pos3.row + 1, grid: pos3.grid + lr },
          ) ||
          checkGridConflict(pos.row + 1, pos.grid + lr) ||
          checkGridConflict(pos1.row + 1, pos1.grid + lr) ||
          checkGridConflict(pos2.row + 1, pos2.grid + lr) ||
          checkGridConflict(pos3.row + 1, pos3.grid + lr)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row + 1, grid: pos.grid + lr },
          { row: pos1.row + 1, grid: pos1.grid + lr },
          { row: pos2.row + 1, grid: pos2.grid + lr },
          { row: pos3.row + 1, grid: pos3.grid + lr },
        );
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row + 1, grid: pos.grid - lr * 2 },
            { row: pos1.row + 1, grid: pos1.grid - lr * 2 },
            { row: pos2.row + 1, grid: pos2.grid - lr * 2 },
            { row: pos3.row + 1, grid: pos3.grid - lr * 2 },
          ) ||
          checkGridConflict(pos.row + 1, pos.grid - lr * 2) ||
          checkGridConflict(pos1.row + 1, pos1.grid - lr * 2) ||
          checkGridConflict(pos2.row + 1, pos2.grid - lr * 2) ||
          checkGridConflict(pos3.row + 1, pos3.grid - lr * 2)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row + 1, grid: pos.grid - lr * 2 },
          { row: pos1.row + 1, grid: pos1.grid - lr * 2 },
          { row: pos2.row + 1, grid: pos2.grid - lr * 2 },
          { row: pos3.row + 1, grid: pos3.grid - lr * 2 },
        );
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row + 2, grid: pos.grid + lr },
            { row: pos1.row + 2, grid: pos1.grid + lr },
            { row: pos2.row + 2, grid: pos2.grid + lr },
            { row: pos3.row + 2, grid: pos3.grid + lr },
          ) ||
          checkGridConflict(pos.row + 2, pos.grid + lr) ||
          checkGridConflict(pos1.row + 2, pos1.grid + lr) ||
          checkGridConflict(pos2.row + 2, pos2.grid + lr) ||
          checkGridConflict(pos3.row + 2, pos3.grid + lr)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row + 2, grid: pos.grid + lr },
          { row: pos1.row + 2, grid: pos1.grid + lr },
          { row: pos2.row + 2, grid: pos2.grid + lr },
          { row: pos3.row + 2, grid: pos3.grid + lr },
        );
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row - 1, grid: pos.grid - lr * 2 },
            { row: pos1.row - 1, grid: pos1.grid - lr * 2 },
            { row: pos2.row - 1, grid: pos2.grid - lr * 2 },
            { row: pos3.row - 1, grid: pos3.grid - lr * 2 },
          ) ||
          checkGridConflict(pos.row - 1, pos.grid - lr * 2) ||
          checkGridConflict(pos1.row - 1, pos1.grid - lr * 2) ||
          checkGridConflict(pos2.row - 1, pos2.grid - lr * 2) ||
          checkGridConflict(pos3.row - 1, pos3.grid - lr * 2)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row - 1, grid: pos.grid - lr * 2 },
          { row: pos1.row - 1, grid: pos1.grid - lr * 2 },
          { row: pos2.row - 1, grid: pos2.grid - lr * 2 },
          { row: pos3.row - 1, grid: pos3.grid - lr * 2 },
        );
      break;

    case 1:
    case 3:
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row + 2, grid: pos.grid - lr },
            { row: pos1.row + 2, grid: pos1.grid - lr },
            { row: pos2.row + 2, grid: pos2.grid - lr },
            { row: pos3.row + 2, grid: pos3.grid - lr },
          ) ||
          checkGridConflict(pos.row + 2, pos.grid - lr) ||
          checkGridConflict(pos1.row + 2, pos1.grid - lr) ||
          checkGridConflict(pos2.row + 2, pos2.grid - lr) ||
          checkGridConflict(pos3.row + 2, pos3.grid - lr)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row + 2, grid: pos.grid - lr },
          { row: pos1.row + 2, grid: pos1.grid - lr },
          { row: pos2.row + 2, grid: pos2.grid - lr },
          { row: pos3.row + 2, grid: pos3.grid - lr },
        );
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row + 2, grid: pos.grid },
            { row: pos1.row + 2, grid: pos1.grid },
            { row: pos2.row + 2, grid: pos2.grid },
            { row: pos3.row + 2, grid: pos3.grid },
          ) ||
          checkGridConflict(pos.row + 2, pos.grid) ||
          checkGridConflict(pos1.row + 2, pos1.grid) ||
          checkGridConflict(pos2.row + 2, pos2.grid) ||
          checkGridConflict(pos3.row + 2, pos3.grid)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row + 2, grid: pos.grid },
          { row: pos1.row + 2, grid: pos1.grid },
          { row: pos2.row + 2, grid: pos2.grid },
          { row: pos3.row + 2, grid: pos3.grid },
        );
      if (
        !(
          checkSpinOutOfBoard(posAlt, pos1Alt, pos2Alt, pos3Alt) ||
          checkGridConflict(posAlt.row, posAlt.grid) ||
          checkGridConflict(pos1Alt.row, pos1Alt.grid) ||
          checkGridConflict(pos2Alt.row, pos2Alt.grid) ||
          checkGridConflict(pos3Alt.row, pos3Alt.grid)
        )
      )
        return setI_MinoSpinned(posAlt, pos1Alt, pos2Alt, pos3Alt);
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row - 1, grid: pos.grid + lr * 2 },
            { row: pos1.row - 1, grid: pos1.grid + lr * 2 },
            { row: pos2.row - 1, grid: pos2.grid + lr * 2 },
            { row: pos3.row - 1, grid: pos3.grid + lr * 2 },
          ) ||
          checkGridConflict(pos.row - 1, pos.grid + lr * 2) ||
          checkGridConflict(pos1.row - 1, pos1.grid + lr * 2) ||
          checkGridConflict(pos2.row - 1, pos2.grid + lr * 2) ||
          checkGridConflict(pos3.row - 1, pos3.grid + lr * 2)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row - 1, grid: pos.grid + lr * 2 },
          { row: pos1.row - 1, grid: pos1.grid + lr * 2 },
          { row: pos2.row - 1, grid: pos2.grid + lr * 2 },
          { row: pos3.row - 1, grid: pos3.grid + lr * 2 },
        );
      if (
        !(
          checkSpinOutOfBoard(
            { row: pos.row - 1, grid: pos.grid },
            { row: pos1.row - 1, grid: pos1.grid },
            { row: pos2.row - 1, grid: pos2.grid },
            { row: pos3.row - 1, grid: pos3.grid },
          ) ||
          checkGridConflict(pos.row - 1, pos.grid) ||
          checkGridConflict(pos1.row - 1, pos1.grid) ||
          checkGridConflict(pos2.row - 1, pos2.grid) ||
          checkGridConflict(pos3.row - 1, pos3.grid)
        )
      )
        return setI_MinoSpinned(
          { row: pos.row - 1, grid: pos.grid },
          { row: pos1.row - 1, grid: pos1.grid },
          { row: pos2.row - 1, grid: pos2.grid },
          { row: pos3.row - 1, grid: pos3.grid },
        );
      break;

    default:
      return 0;
  }
  return 0;
};
const checkSpinMinoConflict = (pos, pos1, pos2, pos3, lr) => {
  if (
    !(
      checkSpinOutOfBoard(pos, pos1, pos2, pos3) ||
      checkGridConflict(pos.row, pos.grid) ||
      checkGridConflict(pos1.row, pos1.grid) ||
      checkGridConflict(pos2.row, pos2.grid) ||
      checkGridConflict(pos3.row, pos3.grid)
    )
  )
    return 1;
  if (
    gameData.curMino == minoDatas[6].name &&
    !(
      checkSpinOutOfBoard(
        { row: pos.row, grid: pos.grid - lr },
        { row: pos1.row, grid: pos1.grid - lr },
        { row: pos2.row, grid: pos2.grid - lr },
        { row: pos3.row, grid: pos3.grid - lr },
      ) ||
      checkGridConflict(pos.row, pos.grid - lr) ||
      checkGridConflict(pos1.row, pos1.grid - lr) ||
      checkGridConflict(pos2.row, pos2.grid - lr) ||
      checkGridConflict(pos3.row, pos3.grid - lr)
    )
  ) {
    scoreData.isT_Spin = `mini`;
    return 9;
  }
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row, grid: pos.grid + lr },
        { row: pos1.row, grid: pos1.grid + lr },
        { row: pos2.row, grid: pos2.grid + lr },
        { row: pos3.row, grid: pos3.grid + lr },
      ) ||
      checkGridConflict(pos.row, pos.grid + lr) ||
      checkGridConflict(pos1.row, pos1.grid + lr) ||
      checkGridConflict(pos2.row, pos2.grid + lr) ||
      checkGridConflict(pos3.row, pos3.grid + lr)
    )
  )
    return 2;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 1, grid: pos.grid + lr },
        { row: pos1.row + 1, grid: pos1.grid + lr },
        { row: pos2.row + 1, grid: pos2.grid + lr },
        { row: pos3.row + 1, grid: pos3.grid + lr },
      ) ||
      checkGridConflict(pos.row + 1, pos.grid + lr) ||
      checkGridConflict(pos1.row + 1, pos1.grid + lr) ||
      checkGridConflict(pos2.row + 1, pos2.grid + lr) ||
      checkGridConflict(pos3.row + 1, pos3.grid + lr)
    )
  )
    return 3;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 1, grid: pos.grid },
        { row: pos1.row + 1, grid: pos1.grid },
        { row: pos2.row + 1, grid: pos2.grid },
        { row: pos3.row + 1, grid: pos3.grid },
      ) ||
      checkGridConflict(pos.row + 1, pos.grid) ||
      checkGridConflict(pos1.row + 1, pos1.grid) ||
      checkGridConflict(pos2.row + 1, pos2.grid) ||
      checkGridConflict(pos3.row + 1, pos3.grid)
    )
  )
    return 4;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 1, grid: pos.grid - lr },
        { row: pos1.row + 1, grid: pos1.grid - lr },
        { row: pos2.row + 1, grid: pos2.grid - lr },
        { row: pos3.row + 1, grid: pos3.grid - lr },
      ) ||
      checkGridConflict(pos.row + 1, pos.grid - lr) ||
      checkGridConflict(pos1.row + 1, pos1.grid - lr) ||
      checkGridConflict(pos2.row + 1, pos2.grid - lr) ||
      checkGridConflict(pos3.row + 1, pos3.grid - lr)
    )
  )
    return 5;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 2, grid: pos.grid + lr },
        { row: pos1.row + 2, grid: pos1.grid + lr },
        { row: pos2.row + 2, grid: pos2.grid + lr },
        { row: pos3.row + 2, grid: pos3.grid + lr },
      ) ||
      checkGridConflict(pos.row + 2, pos.grid + lr) ||
      checkGridConflict(pos1.row + 2, pos1.grid + lr) ||
      checkGridConflict(pos2.row + 2, pos2.grid + lr) ||
      checkGridConflict(pos3.row + 2, pos3.grid + lr)
    )
  )
    return 6;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 2, grid: pos.grid },
        { row: pos1.row + 2, grid: pos1.grid },
        { row: pos2.row + 2, grid: pos2.grid },
        { row: pos3.row + 2, grid: pos3.grid },
      ) ||
      checkGridConflict(pos.row + 2, pos.grid) ||
      checkGridConflict(pos1.row + 2, pos1.grid) ||
      checkGridConflict(pos2.row + 2, pos2.grid) ||
      checkGridConflict(pos3.row + 2, pos3.grid)
    )
  )
    return 7;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row + 2, grid: pos.grid - lr },
        { row: pos1.row + 2, grid: pos1.grid - lr },
        { row: pos2.row + 2, grid: pos2.grid - lr },
        { row: pos3.row + 2, grid: pos3.grid - lr },
      ) ||
      checkGridConflict(pos.row + 2, pos.grid - lr) ||
      checkGridConflict(pos1.row + 2, pos1.grid - lr) ||
      checkGridConflict(pos2.row + 2, pos2.grid - lr) ||
      checkGridConflict(pos3.row + 2, pos3.grid - lr)
    )
  )
    return 8;
  if (
    gameData.curMino !== minoDatas[6].name &&
    !(
      checkSpinOutOfBoard(
        { row: pos.row, grid: pos.grid - lr },
        { row: pos1.row, grid: pos1.grid - lr },
        { row: pos2.row, grid: pos2.grid - lr },
        { row: pos3.row, grid: pos3.grid - lr },
      ) ||
      checkGridConflict(pos.row, pos.grid - lr) ||
      checkGridConflict(pos1.row, pos1.grid - lr) ||
      checkGridConflict(pos2.row, pos2.grid - lr) ||
      checkGridConflict(pos3.row, pos3.grid - lr)
    )
  )
    return 9;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row - 1, grid: pos.grid },
        { row: pos1.row - 1, grid: pos1.grid },
        { row: pos2.row - 1, grid: pos2.grid },
        { row: pos3.row - 1, grid: pos3.grid },
      ) ||
      checkGridConflict(pos.row - 1, pos.grid) ||
      checkGridConflict(pos1.row - 1, pos1.grid) ||
      checkGridConflict(pos2.row - 1, pos2.grid) ||
      checkGridConflict(pos3.row - 1, pos3.grid)
    )
  )
    return 10;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row - 1, grid: pos.grid + lr },
        { row: pos1.row - 1, grid: pos1.grid + lr },
        { row: pos2.row - 1, grid: pos2.grid + lr },
        { row: pos3.row - 1, grid: pos3.grid + lr },
      ) ||
      checkGridConflict(pos.row - 1, pos.grid + lr) ||
      checkGridConflict(pos1.row - 1, pos1.grid + lr) ||
      checkGridConflict(pos2.row - 1, pos2.grid + lr) ||
      checkGridConflict(pos3.row - 1, pos3.grid + lr)
    )
  )
    return 11;
  if (
    !(
      checkSpinOutOfBoard(
        { row: pos.row - 1, grid: pos.grid - lr },
        { row: pos1.row - 1, grid: pos1.grid - lr },
        { row: pos2.row - 1, grid: pos2.grid - lr },
        { row: pos3.row - 1, grid: pos3.grid - lr },
      ) ||
      checkGridConflict(pos.row - 1, pos.grid - lr) ||
      checkGridConflict(pos1.row - 1, pos1.grid - lr) ||
      checkGridConflict(pos2.row - 1, pos2.grid - lr) ||
      checkGridConflict(pos3.row - 1, pos3.grid - lr)
    )
  )
    return 12;
  return 0;
};

const checkSpinConflict = (direction) => {
  const pos = {
    row: gameData.minoPos.spinPos.row,
    grid: gameData.minoPos.spinPos.grid,
  };
  const pos1 = { row: undefined, grid: undefined };
  const pos2 = { row: undefined, grid: undefined };
  const pos3 = { row: undefined, grid: undefined };
  const spin =
    direction == `left`
      ? (gameData.minoSpin + 3) % 4
      : (gameData.minoSpin + 1) % 4;
  const lr = direction == `left` ? -1 : 1;
  switch (spin) {
    case 0:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          pos.row += direction == `left` ? 0 : -1;
          pos.grid += direction == `left` ? -1 : 0;
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 2;
          return checkSpinI_MinoConflict(pos, pos1, pos2, pos3, lr, spin);

        case minoDatas[2].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row - 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row - 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[3].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row - 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[4].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row - 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[5].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[6].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        default:
          break;
      }
      break;

    case 1:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          pos.row += direction == `left` ? -1 : 0;
          pos.grid += direction == `left` ? 0 : 1;
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row + 2;
          pos3.grid = pos.grid;
          return checkSpinI_MinoConflict(pos, pos1, pos2, pos3, lr, spin);

        case minoDatas[2].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[3].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid + 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[4].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[5].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row - 1;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[6].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        default:
          break;
      }
      break;

    case 2:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          pos.row += direction == `left` ? 0 : 1;
          pos.grid += direction == `left` ? 1 : 0;
          pos1.row = pos.row;
          pos1.grid = pos.grid - 2;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinI_MinoConflict(pos, pos1, pos2, pos3, lr, spin);

        case minoDatas[2].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid + 1;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[3].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[4].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[5].name:
          pos1.row = pos.row;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[6].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row;
          pos3.grid = pos.grid + 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        default:
          break;
      }
      break;

    case 3:
      switch (gameData.curMino) {
        case minoDatas[0].name:
          pos.row += direction == `left` ? 1 : 0;
          pos.grid += direction == `left` ? 0 : -1;
          pos1.row = pos.row - 2;
          pos1.grid = pos.grid;
          pos2.row = pos.row - 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinI_MinoConflict(pos, pos1, pos2, pos3, lr, spin);

        case minoDatas[2].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[3].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid - 1;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[4].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid - 1;
          pos2.row = pos.row - 1;
          pos2.grid = pos.grid;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[5].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row + 1;
          pos2.grid = pos.grid - 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        case minoDatas[6].name:
          pos1.row = pos.row - 1;
          pos1.grid = pos.grid;
          pos2.row = pos.row;
          pos2.grid = pos.grid + 1;
          pos3.row = pos.row + 1;
          pos3.grid = pos.grid;
          return checkSpinMinoConflict(pos, pos1, pos2, pos3, lr);

        default:
          break;
      }
      break;

    default:
      return;
  }
};

const checkT_SpinOutOfBoard = (row, grid) => {
  return row < -4 || row > 19 || grid < 0 || grid > 9;
};

const checkT_Spin = () => {
  const pos = gameData.minoPos.spinPos;
  return (
    (checkT_SpinOutOfBoard(pos.row - 1, pos.grid - 1) ||
    checkGridConflict(pos.row - 1, pos.grid - 1)
      ? 1
      : 0) +
    (checkT_SpinOutOfBoard(pos.row - 1, pos.grid + 1) ||
    checkGridConflict(pos.row - 1, pos.grid + 1)
      ? 1
      : 0) +
    (checkT_SpinOutOfBoard(pos.row + 1, pos.grid - 1) ||
    checkGridConflict(pos.row + 1, pos.grid - 1)
      ? 1
      : 0) +
    (checkT_SpinOutOfBoard(pos.row + 1, pos.grid + 1) ||
    checkGridConflict(pos.row + 1, pos.grid + 1)
      ? 1
      : 0)
  );
};

/* 스핀 시 미노 이동 우선순위 (spinPos 기준) (I, O 미노 제외):
1. 본래 위치
2. 스핀 방향 앞 같은 높이
3~5. 한 칸 아래 (스핀 방향 -> 반대 방향)
6~8. 두 칸 아래 (스핀 방향 -> 반대 방향)
9. 스핀 반대 방향 같은 높이
10~12. 한 칸 위 (직상, 스핀 방향, 반대 방향)
-> 총 12 케이스
*/

/* T 스핀 스페셜 (기본 우선순위에서 약간 변형됨):
1. 본래 위치
2~3. 같은 높이 (반대 방향 -> 스핀 방향)
4~6. 한 칸 아래 (스핀 방향 -> 반대 방향)
7~9. 두 칸 아래 (스핀 방향 -> 반대 방향)
10~12. 한 칸 위 (직상, 스핀 방향, 반대 방향)
*/

/* 스핀 시 미노 이동 우선순위 (spinPos) (I 미노 전용):
1. [스핀 시프트 후] 본래 위치
<가로 방향>
2. 스핀 시프트 대각 반전 위치
[기준점을 row가 높은 쪽으로 고정]
3~4. 한 칸 아래 (스핀 방향, 반대 방향 * 2)
5. 두 칸 아래 스핀 방향
6. 한 칸 위 반대 방향 * 2
<세로 방향>
[기준점 변경된 상태]
2~3. 두 칸 아래 (반대 방향, 직강)
4. 스핀 시프트 대각 반전 위치 [기준점 미적용]
5~6. 한 칸 위 (스핀 방향 * 2, 직상)
-> 총 2(공통) + 4(가로) + 4(세로) = 10 케이스
*/
const spinLeft = () => {
  const checkConflict = checkSpinConflict(`left`);
  if (gameData.curMino == minoDatas[1].name) {
    gameData.isSpinned = true;
    return;
  }
  minoRemovePrev();
  switch (gameData.curMino) {
    case minoDatas[0].name:
      if (!checkConflict) {
        rendMino();
        return;
      }
      break;

    case minoDatas[2].name:
    case minoDatas[3].name:
    case minoDatas[4].name:
    case minoDatas[5].name:
    case minoDatas[6].name:
      switch (checkConflict) {
        case 1:
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 2:
          gameData.minoPos.spinPos.grid -= 1;
          break;

        case 3:
          gameData.minoPos.spinPos.row += 1;
          gameData.minoPos.spinPos.grid -= 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 4:
          gameData.minoPos.spinPos.row += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 5:
          gameData.minoPos.spinPos.row += 1;
          gameData.minoPos.spinPos.grid += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 6:
          gameData.minoPos.spinPos.row += 2;
          gameData.minoPos.spinPos.grid -= 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 7:
          gameData.minoPos.spinPos.row += 2;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 8:
          gameData.minoPos.spinPos.row += 2;
          gameData.minoPos.spinPos.grid += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 9:
          gameData.minoPos.spinPos.grid += 1;
          break;

        case 10:
          gameData.minoPos.spinPos.row -= 1;
          break;

        case 11:
          gameData.minoPos.spinPos.row -= 1;
          gameData.minoPos.spinPos.grid -= 1;
          break;

        case 12:
          gameData.minoPos.spinPos.row -= 1;
          gameData.minoPos.spinPos.grid += 1;
          break;

        default:
          rendMino();
          return;
      }
      break;

    default:
      rendMino();
      return;
  }
  gameData.isSpinned = true;
  gameData.minoSpin = (gameData.minoSpin + 3) % 4;
  setMinoRendGrids();
  rendMino();
};
const spinRight = () => {
  const checkConflict = checkSpinConflict(`right`);
  if (gameData.curMino == minoDatas[1].name) {
    gameData.isSpinned = true;
    return;
  }
  minoRemovePrev();
  switch (gameData.curMino) {
    case minoDatas[0].name:
      if (!checkConflict) {
        rendMino();
        return;
      }
      break;

    case minoDatas[2].name:
    case minoDatas[3].name:
    case minoDatas[4].name:
    case minoDatas[5].name:
    case minoDatas[6].name:
      switch (checkConflict) {
        case 1:
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 2:
          gameData.minoPos.spinPos.grid += 1;
          break;

        case 3:
          gameData.minoPos.spinPos.row += 1;
          gameData.minoPos.spinPos.grid += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 4:
          gameData.minoPos.spinPos.row += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 5:
          gameData.minoPos.spinPos.row += 1;
          gameData.minoPos.spinPos.grid -= 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 6:
          gameData.minoPos.spinPos.row += 2;
          gameData.minoPos.spinPos.grid += 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 7:
          gameData.minoPos.spinPos.row += 2;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 8:
          gameData.minoPos.spinPos.row += 2;
          gameData.minoPos.spinPos.grid -= 1;
          if (gameData.curMino == minoDatas[6].name && checkT_Spin() >= 3)
            scoreData.isT_Spin = true;
          break;

        case 9:
          gameData.minoPos.spinPos.grid -= 1;
          break;

        case 10:
          gameData.minoPos.spinPos.row -= 1;
          break;

        case 11:
          gameData.minoPos.spinPos.row -= 1;
          gameData.minoPos.spinPos.grid += 1;
          break;

        case 12:
          gameData.minoPos.spinPos.row -= 1;
          gameData.minoPos.spinPos.grid -= 1;
          break;

        default:
          rendMino();
          return;
      }
      break;

    default:
      rendMino();
      return;
  }
  gameData.isSpinned = true;
  gameData.minoSpin = (gameData.minoSpin + 1) % 4;
  setMinoRendGrids();
  rendMino();
};

export const toggleRestartBtn = (toggle = `on`) => {
  if (toggle == `on`) {
    spinReview.classList.add(`info_hidden`);
    restartBtn.classList.remove(`info_hidden`);
  } else {
    spinReview.classList.remove(`info_hidden`);
    restartBtn.classList.add(`info_hidden`);
  }
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
      if (keyDatas.downPressed) break;
      keyDatas.downPressed = true;
      keyPressDown();
      intervalId.downKey = setInterval(() => {
        keyPressDown();
      }, gameData.minoDownInterval);
      break;

    case `Left`: // IE/Edge에서 사용되는 값
    case `ArrowLeft`:
      if (keyDatas.leftPressed) break;
      keyDatas.leftPressed = true;
      clearInterval(intervalId.RightKey);
      keyPressLeft();
      intervalId.leftKey = setInterval(() => {
        keyPressLeft();
      }, gameData.minoSideMoveInterval);
      break;

    case `Right`: // IE/Edge에서 사용되는 값
    case `ArrowRight`:
      if (keyDatas.rightPressed) break;
      keyDatas.rightPressed = true;
      clearInterval(intervalId.leftKey);
      keyPressRight();
      intervalId.rightKey = setInterval(() => {
        keyPressRight();
      }, gameData.minoSideMoveInterval);
      break;

    case `Spacebar`: // 옛날 브라우저가 리턴할 가능성 있음
    case ` `:
      if (keyDatas.dropPressed) break;
      keyDatas.dropPressed = true;
      keyPressSpacebar();
      break;

    case keyDatas.spinLeft:
      if (keyDatas.spinLeftPressed) break;
      keyDatas.spinLeftPressed = true;
      spinLeft();
      break;

    case keyDatas.spinRight:
      if (keyDatas.spinRightPressed) break;
      keyDatas.spinRightPressed = true;
      spinRight();
      break;

    case keyDatas.hold:
      if (keyDatas.holdPressed) break;
      keyDatas.holdPressed = true;
      changeHold();
      break;

    case `F12`:
      break;

    default:
      e.preventDefault();
      break;
  }
});

document.addEventListener(`keyup`, (e) => {
  switch (e.key) {
    case `Down`: // IE/Edge에서 사용되는 값
    case `ArrowDown`:
      clearInterval(intervalId.downKey);
      keyDatas.downPressed = false;
      break;

    case `Left`: // IE/Edge에서 사용되는 값
    case `ArrowLeft`:
      clearInterval(intervalId.leftKey);
      keyDatas.leftPressed = false;
      break;

    case `Right`: // IE/Edge에서 사용되는 값
    case `ArrowRight`:
      clearInterval(intervalId.rightKey);
      keyDatas.rightPressed = false;
      break;

    case `Spacebar`: // 옛날 브라우저가 리턴할 가능성 있음
    case ` `:
      keyDatas.dropPressed = false;
      break;

    case keyDatas.spinLeft:
      keyDatas.spinLeftPressed = false;
      break;

    case keyDatas.spinRight:
      keyDatas.spinRightPressed = false;
      break;

    case keyDatas.hold:
      keyDatas.holdPressed = false;
      break;

    case `F12`:
      break;

    default:
      e.preventDefault();
      break;
  }
});

const bgmList = [
  { src: `./bgm/Journey (Kyatto).mp3`, vol: 0.5 },
  { src: `./bgm/ここからはじまるプロローグ。.mp3`, vol: 0.5 },
  { src: `./bgm/Lost in the Snow.mp3`, vol: 0.6 },
  { src: `./bgm/Moonside Howl (Kyatto).mp3`, vol: 0.7 },
  { src: `./bgm/エンドロールはつづいてく。.mp3`, vol: 0.4 },
];
const bgm = [new Audio(bgmList[0].src)];
const bgmFade = (bgm, vol, fadeTime) => {
  if (fadeTime > 0) {
    bgm.volume += ((vol - bgm.volume) * 10) / fadeTime;
    setTimeout(() => {
      bgmFade(bgm, vol, fadeTime - 10);
    }, 10);
  } else {
    bgm.volume = vol;
    if (vol === 0) bgm.pause();
  }
};
export const bgmStart = (fadeTime) => {
  gameData.curBgm = 0;
  bgm[0].volume = 0;
  bgm[0].autoplay = false;
  bgm[0].loop = true;
  bgm[0].load();
  bgm[0].play();
  bgmFade(bgm[0], bgmList[0].vol, fadeTime);
};
// export const bgmCrossFade = (bgmNextID, fadeTime) => {
//   gameData.curBgm = bgmNextID;
//   const bgmNext = new Audio(bgmList[bgmNextID].src);
//   bgmNext.volume = 0;
//   bgmNext.autoplay = false;
//   bgmNext.loop = true;
//   bgmNext.load();
//   bgmNext.play();
//   bgmFade(bgm[0], 0, fadeTime);
//   bgmFade(bgmNext, bgmList[bgmNextID].vol, fadeTime);
//   setTimeout(() => {
//     bgm[0] = bgmNext;
//   }, fadeTime);
// };
export const bgmCrossFade = (fadeTime) => {
  Array(bgmList.length)
    .fill(0)
    .forEach((x, i) => {
      if (
        i !== bgmList.length &&
        gameData.curBgm !== i &&
        gameData.score >= 50000 * i ** 2 &&
        gameData.score < 50000 * (i + 1) ** 2
      ) {
        gameData.curBgm = i;
        const bgmNext = new Audio(bgmList[i].src);
        bgmNext.volume = 0;
        bgmNext.autoplay = false;
        bgmNext.loop = true;
        bgmNext.load();
        bgmNext.play();
        bgmFade(bgm[0], 0, fadeTime);
        bgmFade(bgmNext, bgmList[i].vol, fadeTime);
        setTimeout(() => {
          bgm[0] = bgmNext;
        }, fadeTime + 1000);
      }
    });
};

console.log(
  // rendNext,
  // rendHold,
  gameData,
  gameGridData,
  // takeoutNext,
  // toggleRestartBtn,
  // bgmStart,
  // bgmCrossFade,
);
