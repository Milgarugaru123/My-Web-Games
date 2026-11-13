import "./cards.css";

type CardShapes = `diamond` | `heart` | `clover` | `spade`;
type CardVals = `A` | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | `J` | `Q` | `K`;
type Cards = { shape: CardShapes; val: CardVals };

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

const Card = () => {
  const trumpCards: Cards[][] = Array(cardShapes.length)
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
                className={`card_frame mx-auto val_${card.val}`}
              >
                <div className={`shape_${card.shape}`}></div>
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default Card;
