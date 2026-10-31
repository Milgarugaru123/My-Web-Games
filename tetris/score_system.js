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
  rendNext,
  rendHold,
  gameData,
  gameGridData,
  takeoutNext,
  toggleRestartBtn,
  bgmStart,
  bgmCrossFade,
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
  prevScore: 0,
  lineCleared: 0,
  isT_Spin: false,
  isBTB: false,
  combo: 0,
  maxedScoreLen: undefined,
};

export const rendScore = () => {
  const scoreStr = [...String(gameData.score)];
  const score = scoreStr
    .map((x, i) => {
      if ((scoreStr.length - i) % 3 === 1 && i + 1 !== scoreStr.length)
        return x + `,`;
      else return x;
    })
    .reduce((x, y) => x + y);
  curScore.innerHTML = score;
  // if (
  //   gameData.curBgm !== 1 &&
  //   gameData.score >= 10000 &&
  //   gameData.score < 100000
  // )
  //   bgmCrossFade(1, 3000);
  // if (
  //   gameData.curBgm !== 2 &&
  //   gameData.score >= 100000 &&
  //   gameData.score < 500000
  // )
  //   bgmCrossFade(2, 3000);
  // if (
  //   gameData.curBgm !== 3 &&
  //   gameData.score >= 500000 &&
  //   gameData.score < 1000000
  // )
  //   bgmCrossFade(3, 3000);
  // if (
  //   gameData.curBgm !== 4 &&
  //   gameData.score >= 1000000 &&
  //   gameData.score < 2000000
  // )
  //   gameData.curBgm = 4; // 브금 추가되면...
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
  const baseScore = 10;
  const alpha = makeAlpha(baseScore);
  gameData.score += baseScore + (alpha < 0 ? 0 : alpha);
  rendScore();
};
export const hardDropScore = (height) => {
  const baseScore = 10;
  const alpha = makeAlpha(baseScore);
  const h = Math.ceil(Math.sqrt((height * 3) / 11));
  gameData.score += (baseScore + (alpha < 0 ? 0 : alpha)) * height * h;
  rendScore();
};

export const lineClearScore = (isAllClear) => {
  const baseScore = 100;
  const alpha = makeAlpha(baseScore);
  gameData.score += Math.floor(
    (baseScore * (isAllClear ? 5 : 1) + alpha) *
      scoreData.lineCleared *
      (scoreData.isT_Spin ? (scoreData.isT_Spin === `mini` ? 1.3 : 2) : 1) *
      (scoreData.isBTB ? 1.5 : 1) *
      (1 + 0.1 * ((scoreData.combo > 15 ? 15 : scoreData.combo) - 1)),
  );
  console.log(
    `${scoreData.combo} 콤보!\n${scoreData.isBTB ? `Back to Back!\n` : ``}${isAllClear ? `올 클리어!` : ``}`,
  );
  rendScore();
};

console.log(
  scoreData,
  // rendScore,
  // softDropScore,
  // hardDropScore,
  // lineClearScore,
);
