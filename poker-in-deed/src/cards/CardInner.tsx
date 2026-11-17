import { CardShapes, CardVals, TCard } from "./cardType";

const CardInner = ({ shape, val }: TCard) => {
  if (val == `A`)
    return (
      <div className={`w-full h-full flex justify-center items-center`}>
        <div className={`w-2/3 aspect-square`}>
          <div className={`shape_${shape}`}></div>
        </div>
      </div>
    );
  else if (typeof val == `string`)
    return <div className={`shape_${shape} p-10`}></div>;
  return (
    <div
      className={`w-full h-full p-10 flex flex-col flex-wrap justify-between items-center gap-2`}
    >
      {Array(val)
        .fill(0)
        .map((card, i) => {
          return (
            <div className={`w-[20%] aspect-square`}>
              <div className={`shape_${shape}`}></div>
            </div>
          );
        })}
    </div>
  );
};

export default CardInner;
