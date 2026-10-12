const clicker = document.querySelector(`.main`);
const desc = document.querySelector(`.desc`);
const subDesc = document.querySelector(`.sub_desc`);
const high = document.querySelector(`.highscore`);

const timeCheck = { start: 0, end: 0, high: 0 };
const timeoutID = [];

const highScore = (score) => {
  if (timeCheck.high === 0) timeCheck.high = score;
  else timeCheck.high = timeCheck.high < score ? timeCheck.high : score;
  high.innerHTML = `최고 <span style="font-weight: bold">${timeCheck.high}ms</span>`;
};

const toRed = (target) => {
  target.style.backgroundColor = `rgb(239, 68, 68)`;
  desc.innerHTML = `기다려...`;
  subDesc.innerHTML = `초록색이 되면 누르는 거야~`;
};

const toGreen = (target) => {
  timeCheck.start = Date.now();
  target.style.backgroundColor = `rgb(75, 190, 90)`;
  desc.innerHTML = `지금!`;
  subDesc.innerHTML = `빨리 안 누르고 뭐해!`;
};

const toSuccess = (target) => {
  timeCheck.end = Date.now();
  const score = timeCheck.end - timeCheck.start;
  highScore(score);
  target.style.backgroundColor = `rgb(14, 165, 233)`;
  desc.innerHTML = `${score}ms`;
  subDesc.innerHTML = `흥, 좀 하네 ─ 클릭해서 다시`;
};

const toFail = (target) => {
  target.style.backgroundColor = `rgb(245, 158, 11)`;
  desc.innerHTML = `허접~`;
  subDesc.innerHTML = `이런 것도 못해? ─ 클릭해서 다시`;
};

clicker.addEventListener(`click`, (e) => {
  const target = e.currentTarget;
  clearTimeout(timeoutID.shift());
  if (target.style.backgroundColor == `rgb(75, 190, 90)`) {
    toSuccess(target);
  } else if (target.style.backgroundColor == `rgb(239, 68, 68)`) {
    toFail(target);
  } else {
    toRed(target);
    timeoutID.push(
      setTimeout(
        () => {
          toGreen(target);
        },
        (Math.random() * 4 + 1) * 1000,
      ),
    );
  }
});
