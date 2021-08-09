import {Segment} from "@/model/segment";
import {colorToLetter} from "@/model/segment-color";


export function stalkValue(stalk: string | Segment[]) {

  const charArray = typeof stalk == "string" ? [...stalk] : stalk.map(s => colorToLetter(s.color));

  let change = false;
  let size = 1;

  return charArray.reduce( (acc, curr, i, arr) => {
    if (!change && i > 0 && curr != arr[i - 1])
      change = true;

    if (change)
      size /= 2;

    if (curr == "L")
      return acc + size;
    return acc - size;

  }, 0)
}

export function stalkString(value: number, maxFracLength = 30) {
  const intPart = parseInt(`${value}`);
  const intString = Array
    .from({length: Math.abs(intPart)})
    .fill(intPart > 0 ? "L" : "R")
    .join("");

  let fracLeft = value - intPart;
  let size = 1;
  let fracString = "";

  while (fracLeft != 0) {
    if (fracString.length >= maxFracLength) {
      fracString += "...";
      break;
    }
    if (fracLeft > 0) {
      fracString += "L";
      fracLeft -= size;
    } else if (fracLeft < 0) {
      fracString += "R";
      fracLeft += size;
    }
    size /= 2;
  }

  return intString + fracString;
}

export function simplestBetween(left: number | undefined, right: number | undefined) {
  if (left === undefined && right === undefined)
    return 0;
  if (right === undefined)
    return Math.trunc(left!) + 1;
  if (left === undefined)
    return Math.trunc(right!) - 1;
  if (left >= right) {
    throw new Error("Right number must be greater than the left");
  }
  if (left < 0 && right > 0)
    return 0;

  let leftString = stalkString(left);
  let rightString = stalkString(right);
  let o;
  for (o = 0;
       o < Math.min(leftString.length, rightString.length) &&
       leftString[o] == rightString[o];
       o++);
  const overlap = leftString.slice(0, o);
  const leftRemainder = leftString.slice(o);
  const rightRemainder = rightString.slice(o);
  if (leftRemainder && rightRemainder)
    return stalkValue(overlap);

  const hasRemaining = leftRemainder || rightRemainder;
  const opp = leftRemainder ? "R" : "L";
  const same = leftRemainder ? "L" : "R";

  if (hasRemaining.startsWith(`${opp}${opp}`)) {
    return stalkValue(overlap + opp);
  }
  if (hasRemaining == opp) {
    return stalkValue(overlap + opp + same);
  }
  return stalkValue(overlap + hasRemaining.slice(0, hasRemaining.lastIndexOf(same)) + `${same}${same}`);

}
