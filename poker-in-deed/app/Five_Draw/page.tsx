import { makeSideShape } from "@/src/cards/Card";
import CardBack from "@/src/cards/CardBack";
import CardInner from "@/src/cards/CardInner";
import { TCard } from "@/src/cards/cardType";

const fiveCardDraw = () => {
  const card: TCard = { shape: "diamond", val: 2 };
  return (
    <>
      <div className={`w-50 absolute left-25 top-30`}>
        <div className={`rotate-270`}>
          <CardBack />
        </div>
      </div>
      <div className={`w-50 absolute left-25 top-100`}>
        <div className={`card_frame val_${card.val} relative rotate-270`}>
          <CardInner shape={card.shape} val={card.val} />
          {makeSideShape(card)}
        </div>
      </div>
    </>
  );
};

export default fiveCardDraw;
