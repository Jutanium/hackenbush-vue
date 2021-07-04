
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

export function connectionsEqual(connection1: Connection, connection2: Connection) {
  return connection1.id == connection2.id && connection1.side == connection2.side;
}

export type Segment = {
  id: string,
  color: Color,
  start: Point,
  end: Point
  curveControlStart?: Point,
  curveControlEnd?: Point,
}