const timer = document.querySelector(`.timer span`);
const highscore = document.querySelector(`.highscore`);
const scoreboard = document.querySelector(`.score span`);
const holes = [...document.querySelectorAll(`.hole`)];
const desc = document.querySelector(`.desc`);
const playBtn = document.querySelector(`.play_btn`);

console.log(timer, highscore, scoreboard, holes, desc, playBtn);

const playData = {
  maxTimer: 30,
  moleInterval: 950, // 기본은 800
  moleIntervalID: undefined,
  descIntervalID: undefined,
  highscore: 0,
  score: 0,
  isPlaying: false,
};
const playDesc = `<s>두더</s>쥐를 잡자 쥐를 잡자 찍! 찍! 찍!`.split(` `);
console.log(playDesc);

desc.innerHTML = `시작을 누르면 ${playData.maxTimer}초 동안 두더지가 튀어나옴`;

const descLoop = (count) => {
  if (count === playDesc.length)
    playData.descIntervalID = setTimeout(() => {
      descLoop(0);
    }, 800);
  else {
    desc.innerHTML = Array(count + 1)
      .fill(0)
      .map((x, i) => (x = playDesc[i]))
      .reduce((x, y) => x + ` ` + y);
    playData.descIntervalID = setTimeout(() => {
      descLoop(count + 1);
    }, 500);
  }
};

highscore.querySelector(`span`).addEventListener(`change`, () => {
  highscore.classList.remove(`hidden`);
});

holes.forEach((x) => {
  const mole = document.createElement(`img`);
  mole.style.cssText = `width: 60%; height: 60%; object-fit: contain; display: block; margin: 0 auto; position: relative; transition: all 0.1s; top: 20%`;
  mole.src = "./mole.png";
  mole.classList.add(`mole_hide`);
  x.appendChild(mole);
  x.addEventListener(`mousedown`, () => {
    if (!playData.isPlaying) return;
    if (!mole.classList.contains(`mole_hide`)) {
      mole.classList.add(`mole_hide`);
      playData.score += 1;
      scoreboard.innerHTML = playData.score;
    }
  });
});

const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

const moleShow = (hole, prevHole) => {
  if (!playData.isPlaying) return;
  holes[prevHole].querySelector(`img`).classList.add(`mole_hide`);
  holes[hole].querySelector(`img`).classList.remove(`mole_hide`);
  playData.moleIntervalID = setTimeout(
    () => {
      const nextHole = Math.floor(Math.random() * 9);
      moleShow(
        nextHole === hole
          ? nextHole === 4
            ? Math.floor(Math.random() * 4)
            : 8 - nextHole
          : nextHole,
        hole,
      );
    },
    playData.moleInterval - playData.score * 10,
  );
};

const gameEnd = () => {
  clearTimeout(playData.moleIntervalID);
  clearTimeout(playData.descIntervalID);
  holes.forEach((hole) => {
    hole.classList.remove(`cursor_avail`);
    hole.querySelector(`img`).classList.add(`mole_hide`);
  });
  desc.innerHTML = `끝! ${playData.score} 마리 잡았다!`;
  playBtn.innerHTML = `다시 잡으러 고 ~`;
  playBtn.classList.remove(`cursor_inavail`);
  playBtn.classList.add(`cursor_avail`);
  if (playData.highscore < playData.score) {
    playData.highscore = playData.score;
    highscore.querySelector(`span`).innerHTML = playData.highscore;
  }
  if (highscore.classList.contains(`hidden`))
    highscore.classList.remove(`hidden`);
};

const timerDown = (currentTime) => {
  timer.innerHTML = `${currentTime}`;
  if (currentTime === 0) {
    playData.isPlaying = false;
    gameEnd();
  } else
    setTimeout(() => {
      timerDown(currentTime - 1);
    }, 1000);
};

const game = () => {
  playData.score = 0;
  holes.forEach((hole) => {
    hole.classList.add(`cursor_avail`);
  });
  timerDown(playData.maxTimer);
  moleShow(Math.floor(Math.random() * 9), 0);
};

const countDown = (count) => {
  if (count > 0) {
    desc.innerHTML = `${count}`;
    setTimeout(() => {
      countDown(count - 1);
    }, 1000);
  } else {
    desc.innerHTML = `Start!`;
    setTimeout(() => {
      // desc.innerHTML = `<s>두더</s>쥐를 잡자 쥐를 잡자 찍! 찍! 찍!`;
      descLoop(0);
      playBtn.innerHTML = `게임 플레이 중...`;
      game();
    }, 1000);
  }
};

const gameLoad = () => {
  playBtn.innerHTML = `게임 준비 중...`;
  playBtn.classList.add(`cursor_inavail`);
  playBtn.classList.remove(`cursor_avail`);
  countDown(3);
};

playBtn.addEventListener(`click`, () => {
  if (!playData.isPlaying) {
    playData.isPlaying = true;
    gameLoad();
  }
});
