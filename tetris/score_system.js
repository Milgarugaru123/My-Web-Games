import {
  // holdCase,
  tetrisScreen,
  // nextCase,
  // furtherNextCase,
  curScore,
  highScore,
  // spinReview,
  // restartBtn,
  // comboReview,
  // comboValReview,
  // t_SpinReview,
  // t_SpinMiniReview,
  // tetrisReview,
  // backToBackReview,
} from "./query.js";
import {
  // rendNext,
  // rendHold,
  intervalId,
  gameData,
  // gameGridData,
  // takeoutNext,
  // toggleRestartBtn,
  // bgmStart,
} from "./game.js";

/* 점수 시스템:
- 소프트 드롭(기본: 아래 키) 한 칸: 10 + alpha 점 [alpha값은 Desmos 참고]
- 하드 드롭(기본: 스페이스바): ceil(root({바닥(정지 지점)까지의 높이} * 3 / 11)) * {~높이} * (10 + alpha) 점
- 라인 클리어 시:
    - 싱글: 100 + alpha 점 (기본 점수)
    - 더블: 싱글 * 2
    - 트리플: 싱글 * 3
    - 테트리스: 싱글 * 4
    - T스핀 미니: floor(싱글 * 1.3)
    - T스핀 싱글: 싱글 * 2
    - T스핀 더블: 싱글 * 4
    - T스핀 트리플: 싱글 * 6
    - back-to-back: floor(해당 점수 * 1.5) [테트리스, T스핀 해당]
- 콤보 시:
    - 최대 콤보 수: 15
    - 각 콤보 당 배수: 1 + 0.1 * {콤보 수}
    - 5 콤보 마다 {기본 점수} + alpha
- 홀드 시: 홀드 직전 미노로 얻은 점수 반환
- 바닥에서 스핀으로 점수 쌀먹하기: [대책 필요?]
    -> 바닥에 닿으면 bottomDelay가 0일 경우 0.1 적립
    -> bottomDelay가 0이 아닌 경우 드롭 점수 없음
    -> 빈칸에 드롭 시 (bottomDelay < 1.5 && bottomDelay % 0.5 = 0.1)인 경우 bottomDelay = 0
- All Clear 시 기본 점수 5배 반영
*/

export const scoreData = {
  baseScore: 10, // init: 10점
  balance: 5, // 난이도 및 점수 배수
  prevScore: 0,
  lineCleared: 0,
  isT_Spin: false,
  isBTB: 0,
  combo: 0,
  maxedScoreLen: undefined,
};

const rendScoreForm = (scoreStr) => {
  return scoreStr
    .map((x, i) => {
      if ((scoreStr.length - i) % 3 === 1 && i + 1 !== scoreStr.length)
        return x + `,`;
      else return x;
    })
    .reduce((x, y) => x + y);
};

export const rendScore = () => {
  const scoreStr = [...String(gameData.score)];
  const score = rendScoreForm(scoreStr);
  curScore.innerHTML = score;
};

export const rendHighscore = () => {
  const scoreStr = [...String(gameData.highscore)];
  const score = rendScoreForm(scoreStr);
  highScore.innerHTML = score;
};

const makeAlpha = (mul) => {
  return (
    Math.floor(
      (Math.atan(gameData.score / 10) ** 2) **
        Math.log10(gameData.score + Math.PI) /
        10 -
        1,
    ) * mul
  );
};
export const softDropScore = () => {
  if (gameData.minoPos.spinPos.row <= gameData.maxRow) return;
  const alpha = makeAlpha(scoreData.baseScore);
  gameData.score +=
    (scoreData.baseScore + (alpha < 0 ? 0 : alpha)) *
    Math.ceil(scoreData.balance / 2);
  rendScore();
};
export const hardDropScore = (height) => {
  const alpha = makeAlpha(scoreData.baseScore);
  const h = Math.ceil(Math.sqrt((height * 3) / 11));
  gameData.score +=
    (scoreData.baseScore + (alpha < 0 ? 0 : alpha)) *
    height *
    h *
    Math.ceil(scoreData.balance / 2);
  rendScore();
};

const reviewRotate = (range) =>
  `rotate(${Math.floor(Math.random() * range * 2) - range}deg)`;

export const lineClearScore = (isAllClear) => {
  if (intervalId.allClearReview) {
    clearTimeout(intervalId.allClearReview);
    allClearReview.classList.remove(`review_hide`);
    allClearReview.classList.add(`info_hidden`);
  }
  const baseLineClearScore =
    scoreData.baseScore * 10 * Math.ceil(scoreData.balance / 2);
  const alpha = makeAlpha(baseLineClearScore);
  gameData.score += Math.floor(
    (baseLineClearScore * (isAllClear ? 5 : 1) + alpha) *
      scoreData.lineCleared *
      (scoreData.isT_Spin ? (scoreData.isT_Spin === `mini` ? 1.3 : 2) : 1) *
      (scoreData.isBTB > 1 ? 1.5 : 1) *
      (1 + 0.1 * ((scoreData.combo > 15 ? 15 : scoreData.combo) - 1)) *
      Math.ceil(scoreData.balance / 2),
  );
  if (isAllClear) {
    clearTimeout(intervalId.allClearReview);
    allClearReview.classList.remove(`review_hide`);
    allClearReview.style.transform = reviewRotate(7.5);
    allClearReview.classList.remove(`info_hidden`);
    intervalId.allClearReview = setTimeout(() => {
      allClearReview.classList.add(`review_hide`);
      intervalId.allClearReview = setTimeout(() => {
        allClearReview.classList.remove(`review_hide`);
        allClearReview.classList.add(`info_hidden`);
        intervalId.allClearReview = undefined;
      }, 1000);
    }, 2000);
  }
  rendScore();
};

const allClearReview = document.createElement(`div`);
allClearReview.classList.add(`all_clear`);
allClearReview.classList.add(`review_show`);
allClearReview.classList.add(`info_hidden`);
allClearReview.innerHTML = `All Clear!`;
tetrisScreen.appendChild(allClearReview);

console.log(
  scoreData,
  // rendScore,
  // rendHighscore,
  // softDropScore,
  // hardDropScore,
  // lineClearScore,
);
