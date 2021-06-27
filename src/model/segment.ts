
import type { Color } from "./segment-color"

export type Point = {
  x: number,
  y: number
}

export type Connection = {
  id: string,
  side: "start" | "end"
}

export type Segment = {
  id: string,
  color: Color,
  start: Point,
  end: Point
  curveControlStart?: Point,
  curveControlEnd?: Point,
  startConnection: Connection[],
  endConnection: Connection[],
}