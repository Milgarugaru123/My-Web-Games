import {
  // holdCase,
  // tetrisScreen,
  // nextCase,
  // furtherNextCase,
  curScore,
  highScore,
  // spinReview,
  restartBtn,
  // comboReview,
  // comboValReview,
  // t_SpinReview,
  // t_SpinMiniReview,
  // tetrisReview,
  // backToBackReview,
} from "./query.js";
import {
  // minoDatas,
  // makeMino,
  gridDatas,
  // minoBag,
  refillBag,
} from "./mino_datas.js";
import {
  rendNext,
  rendHold,
  // intervalId,
  gameData,
  // gameGridData,
  takeoutNext,
  toggleRestartBtn,
  bgmStart,
} from "./game.js";
import {
  scoreData,
  rendScore,
  rendHighscore,
  // softDropScore,
  // hardDropScore,
  // lineClearScore,
} from "./score_system.js";
import "./query.js";
import "./mino_datas.js";
import "./game.js";
import "./score_system.js";

const gamePreview = () => {
  refillBag();
  rendNext();
  rendHold();
  gameData.score = 0;
  rendScore();
};

const gameStart = () => {
  scoreData.totalLineCleared = 0;
  scoreData.maxedScoreLen = undefined;
  takeoutNext();
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
  bgmStart(3000);
  countDown(3);
};

restartBtn.addEventListener(`click`, (e) => {
  window.location.reload();
});

/* init */
const prevVersion =
  localStorage.getItem(`Tetris to Go! version`) ??
  gameData.version
    .split(`.`)
    .map((x, i) => {
      if (i === 1) return +x - 1;
      else return x;
    })
    .reduce((x, y) => x + `.` + y);
const versionCompare = (index) =>
  prevVersion.split(`.`)[index] !== gameData.version.split(`.`)[index];
if (prevVersion !== gameData.version) {
  if (versionCompare(0)) localStorage.setItem(`Tetris to Go! highscore`, `0`);
  if (versionCompare(1)) console.log(`version updated`); // 아직은 뭘 할 지 모르겠음
  localStorage.setItem(`Tetris to Go! version`, gameData.version);
}
gameData.highscore = +(localStorage.getItem(`Tetris to Go! highscore`) ?? 0);
curScore.innerHTML = `－－`;
if (gameData.highscore > 0) rendHighscore(gameData.highscore);
else highScore.innerHTML = `－－`;

const startBtn = document.createElement(`button`);
startBtn.innerHTML = `Tetris To Start!`;
startBtn.classList.add(`start_btn`);
document.body.appendChild(startBtn);

startBtn.addEventListener(`click`, () => {
  document.body.removeChild(startBtn);
  toggleRestartBtn(`off`);
  gameReady();
});

console.log(gridDatas[0][0]); // 왼쪽 위
console.log(gridDatas[19][9]); // 오른쪽 아래
