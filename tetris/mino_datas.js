import { tetrisScreen } from "./query.js";

export const minoDatas = [
  {
    name: `I`,
    color: `i_mino`,
    minoFill: [1, 1, 1, 1],
  },
  {
    name: `O`,
    color: `o_mino`,
    minoFill: [1, 1, 1, 1],
  },
  {
    name: `S`,
    color: `s_mino`,
    minoFill: [0, 1, 1, 1, 1, 0],
  },
  {
    name: `Z`,
    color: `z_mino`,
    minoFill: [1, 1, 0, 0, 1, 1],
  },
  {
    name: `L`,
    color: `l_mino`,
    minoFill: [0, 0, 1, 1, 1, 1],
  },
  {
    name: `J`,
    color: `j_mino`,
    minoFill: [1, 0, 0, 1, 1, 1],
  },
  {
    name: `T`,
    color: `t_mino`,
    minoFill: [1, 1, 1, 0, 1, 0],
  },
];

export const makeMino = (minoName) => {
  const mino = document.createElement(`div`);
  switch (minoName) {
    case `I`:
      mino.style.cssText = `width: 80%; height: fit-content; display: grid; grid-template-columns: repeat(4, 1fr);`;
      break;

    case `O`:
      mino.style.cssText = `width: 40%; height: fit-content; display: grid; grid-template-columns: repeat(2, 1fr);`;
      break;

    default:
      mino.style.cssText = `width: 60%; height: fit-content; display: grid; grid-template-columns: repeat(3, 1fr);`;
      break;
  }
  const minoNum = [];
  switch (minoName) {
    case minoDatas[0].name:
      minoNum.push(0);
      break;
    case minoDatas[1].name:
      minoNum.push(1);
      break;
    case minoDatas[2].name:
      minoNum.push(2);
      break;
    case minoDatas[3].name:
      minoNum.push(3);
      break;
    case minoDatas[4].name:
      minoNum.push(4);
      break;
    case minoDatas[5].name:
      minoNum.push(5);
      break;
    case minoDatas[6].name:
      minoNum.push(6);
      break;
  }
  Array(minoDatas[minoNum[0]].minoFill.length)
    .fill(0)
    .forEach((x, i) => {
      const grid = document.createElement(`div`);
      grid.classList.add(`grid_unit`);
      if (minoDatas[minoNum[0]].minoFill[i])
        grid.classList.add(minoDatas[minoNum[0]].color);
      mino.appendChild(grid);
    });
  return mino;
};

export const gridDatas = new Array(20).fill(0).map((row) => {
  return Array(10)
    .fill(0)
    .map((grid) => {
      const gridUnit = document.createElement(`div`);
      gridUnit.classList.add(`grid_unit`);
      tetrisScreen.appendChild(gridUnit);
      return gridUnit;
    });
});

const makeMinoBag = () => {
  const bag = Array(minoDatas.length)
    .fill(0)
    .map((x, i) => {
      return minoDatas[i].name;
    });
  return bag.sort(() => Math.random() - 0.5);
};

export const minoBag = [];

export const refillBag = () => {
  if (minoBag.length > 7) return;
  minoBag.push(...makeMinoBag());
};

console.log(
  minoDatas,
  // makeMino,
  gridDatas,
  minoBag,
  // refillBag,
);
