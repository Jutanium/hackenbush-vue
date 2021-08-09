export enum Color {
  Blue="blue",
  Red="red",
  Green="green"
}

export function colorToLetter(color: Color) {
  switch (color) {
    case Color.Blue:
      return "L";
    case Color.Red:
      return "R";
    default:
      return "G"
  }
}