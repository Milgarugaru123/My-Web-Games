import CardBack from "@/src/cards/CardBack";

const fiveCardDraw = () => {
  return (
    <>
      <div className={`w-50 m-auto`}>
        <div className={`rotate-270`}>
          <CardBack />
        </div>
      </div>
    </>
  );
};

export default fiveCardDraw;
