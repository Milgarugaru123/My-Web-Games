import { CardShapes, CardVals, TCard } from "./cardType";

type MidShape = { top: boolean; mid: boolean; bottom: boolean };

const makeMidShape = (shape: CardShapes, mid: keyof MidShape) => {
  switch (mid) {
    case "top":
      return (
        <>
          <div
            className={`w-[30%] aspect-square p-[6%] absolute inset-x-[35%] inset-y-[22%]`}
          >
            <div className={`shape_${shape}`}></div>
          </div>
        </>
      );

    case "mid":
      return (
        <>
          <div
            className={`w-[30%] aspect-square p-[6%] absolute inset-x-[35%] inset-y-[40%]`}
          >
            <div className={`shape_${shape}`}></div>
          </div>
        </>
      );

    case "bottom":
      return (
        <>
          <div
            className={`w-[30%] aspect-square p-[6%] absolute inset-x-[35%] inset-y-[60%] shape_flip`}
          >
            <div className={`shape_${shape}`}></div>
          </div>
        </>
      );
  }
};

const CardInner = ({ shape, val }: TCard) => {
  const isMidExist: MidShape = {
    top: false,
    mid: false,
    bottom: false,
  };

  switch (val) {
    case `A`:
      return (
        <div className={`w-full h-full flex justify-center items-center`}>
          <div className={`w-2/3 aspect-square`}>
            <div className={`shape_${shape}`}></div>
          </div>
        </div>
      );

    case 3:
      isMidExist.mid = true;
    case 2:
      return (
        <div
          className={`w-full h-full p-[20%] flex flex-col flex-wrap justify-between items-center`}
        >
          {Array(2)
            .fill(0)
            .map((card, i) => {
              return (
                <div
                  className={`w-[30%] aspect-square ${i >= 1 ? `shape_flip` : ``}`}
                >
                  <div className={`shape_${shape}`}></div>
                </div>
              );
            })}
          {isMidExist.mid ? makeMidShape(shape, `mid`) : <></>}
        </div>
      );

    case 5:
      isMidExist.mid = true;
    case 4:
      return (
        <div
          className={`w-full h-full p-[20%] flex flex-wrap justify-between content-between gap-x-[30%]`}
        >
          {Array(4)
            .fill(0)
            .map((card, i) => {
              return (
                <div
                  className={`w-[30%] aspect-square ${i >= 2 ? `shape_flip` : ``}`}
                >
                  <div className={`shape_${shape}`}></div>
                </div>
              );
            })}
          {isMidExist.mid ? makeMidShape(shape, `mid`) : <></>}
        </div>
      );

    case 8:
      isMidExist.bottom = true;
    case 7:
      isMidExist.top = true;
    case 6:
      return (
        <div
          className={`w-full h-full p-[20%] flex flex-wrap justify-between content-between gap-x-[30%]`}
        >
          {Array(6)
            .fill(0)
            .map((card, i) => {
              return (
                <div
                  className={`w-[30%] aspect-square ${i >= 4 ? `shape_flip` : ``}`}
                >
                  <div className={`shape_${shape}`}></div>
                </div>
              );
            })}
          {isMidExist.top ? makeMidShape(shape, `top`) : <></>}
          {isMidExist.bottom ? makeMidShape(shape, `bottom`) : <></>}
        </div>
      );

    case 9:
      isMidExist.mid = true;
    case 10:
      if (!isMidExist.mid) {
        isMidExist.top = true;
        isMidExist.bottom = true;
      }
      return (
        <div
          className={`w-full h-full p-[20%] flex flex-wrap justify-between content-between gap-x-[30%]`}
        >
          {Array(8)
            .fill(0)
            .map((card, i) => {
              return (
                <div
                  className={`w-[30%] aspect-square ${i >= 4 ? `shape_flip` : ``}`}
                >
                  <div className={`shape_${shape}`}></div>
                </div>
              );
            })}
          {isMidExist.mid ? makeMidShape(shape, `mid`) : <></>}
          {isMidExist.top ? makeMidShape(shape, `top`) : <></>}
          {isMidExist.bottom ? makeMidShape(shape, `bottom`) : <></>}
        </div>
      );

    case `J`:
    case `Q`:
    case `K`:
      return <div className={`shape_${shape} p-10`}></div>;
  }
};

export default CardInner;
