import { CardShapes, CardVals } from "./cardType";

const CardInner: { shape: CardShapes; val: CardVals } = ({ shape, val }) => {
  if (val == `A`) return <div className={`shape_${shape}`}></div>;
  return <div className={`shape_${shape}`}></div>;
};

export default CardInner;
