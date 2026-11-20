import CardInner from "./CardInner";
import "./cards.css";
import { CardShapes, CardVals, TCard } from "./cardType";

const cardShapes: Readonly<CardShapes>[] = [
  "diamond",
  "heart",
  "clover",
  "spade",
];
const cardVals: Readonly<CardVals>[] = [
  `A`,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  `J`,
  `Q`,
  `K`,
];

const makeSideShape = ({ shape, val }: TCard) => {
  return (
    <>
      <div
        className={`w-[22%] aspect-square p-[6%] absolute inset-x-[-1%] inset-y-[-2%] flex flex-col items-center`}
      >
        <div
          className={`text-[2cqi] font-bold tracking-tight ${shape == `diamond` || shape == `heart` ? `text-red-500` : `text-black`}`}
        >
          {val}
        </div>
        <div className={`shape_${shape}`}></div>
      </div>
      <div
        className={`w-[22%] aspect-square p-[6%] absolute inset-x-[79%] inset-y-[75.5%] flex flex-col items-center shape_flip`}
      >
        <div
          className={`text-[2cqi] font-bold tracking-tight ${shape == `diamond` || shape == `heart` ? `text-red-500` : `text-black`}`}
        >
          {val}
        </div>
        <div className={`shape_${shape}`}></div>
      </div>
    </>
  );
};

const Card = () => {
  const trumpCards: TCard[][] = Array(cardShapes.length)
    .fill(0)
    .map((_, shape) => {
      return Array(cardVals.length)
        .fill(0)
        .map((_, value) => {
          return { shape: cardShapes[shape], val: cardVals[value] };
        });
    });

  console.log(trumpCards);
  return (
    <>
      <div
        className={`w-full max-w-[90lvw] items-center grid grid-cols-6 gap-3 mx-auto mt-3`}
      >
        {trumpCards.map((shape) => {
          return shape.map((card) => {
            return (
              <div
                key={`${card.shape}-${card.val}`}
                className={`card_frame mx-auto val_${card.val} relative`}
              >
                <CardInner shape={card.shape} val={card.val} />
                {makeSideShape({ shape: card.shape, val: card.val })}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default Card;
