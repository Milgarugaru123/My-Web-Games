export type CardShapes = `diamond` | `heart` | `clover` | `spade`;
export type CardVals =
  | `A`
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | `J`
  | `Q`
  | `K`;
export type TCard = { shape: CardShapes; val: CardVals };
