const desc = document.querySelector(`.desc`);
const subDesc = document.querySelector(`.sub_desc`);
const high = document.querySelector(`.highscore`);
const playBtn = document.querySelector(`.play_btn`);

const playData = { high: undefined, isPlaying: false, id: 0, start: 0, end: 0 };

const countUp = () => {
  playData.end = Date.now();
  const count = playData.end - playData.start;
  if (count > 2800) desc.classList.add(`desc_dark`);
  if (count < 4000) {
    desc.innerHTML = `${(count / 1000).toFixed(2)}`;
  } else {
    desc.innerHTML = `??.??`;
    subDesc.innerHTML = `속으로 잘 세보면..?`;
  }
  // console.log((count / 1000).toFixed(2));
};

const highScore = (score) => {
  if (playData.high === undefined) playData.high = score;
  else playData.high = playData.high < score ? playData.high : score;
  high.innerHTML = `최고 오차 <span style="font-weight: bold">${playData.high}초</span>`;
};

const showResult = () => {
  const result = playData.end - playData.start;
  highScore(Math.abs((result / 1000 - 10).toFixed(2)));
  desc.innerHTML = `${(result / 1000).toFixed(2)}`;
  subDesc.innerHTML = `오차 ${result / 1000 < 10 ? `−` : `✛`}${Math.abs((result / 1000 - 10).toFixed(2))}초`;
  if ((result / 1000).toFixed(2) > 9.5 && (result / 1000).toFixed(2) < 10.5)
    subDesc.insertAdjacentHTML(
      `beforeend`,
      `<br />혹시 시간의 마술사이신가요?`,
    );
  playBtn.innerHTML = `다시`;
};

playBtn.addEventListener(`click`, () => {
  if (!playData.isPlaying) {
    playData.start = Date.now();
    subDesc.innerHTML = `3초 이후에는 시간 표시가 점점 사라지니 주의!`;
    playBtn.innerHTML = `멈춤`;
    playData.id = setInterval(() => {
      countUp();
    }, 10);
  } else {
    clearInterval(playData.id);
    desc.classList.remove(`desc_dark`);
    showResult();
  }
  playData.isPlaying = !playData.isPlaying;
});
