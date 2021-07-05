
import type { Color } from "./segment-color"

export type Point = {
  x: number,
  y: number
}

export type Side = "start" | "end";

export const Sides: Side[] = ["start", "end"];
export type Connection = {
  id: string,
  side: Side
}

export type Segment = {
  id: string,
  color: Color,
  start: Point,
  end: Point
  curveControlStart?: Point,
  curveControlEnd?: Point,
}

export function connectionsEqual(connection1: Connection, connection2: Connection) {
  return connection1.id == connection2.id && connection1.side == connection2.side;
}

export function pointsEqual(point1: Point, point2: Point) {
  return point1.x == point2.x && point1.y == point2.y;
}
