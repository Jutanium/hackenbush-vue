
import type { Color } from "./segmentColor"

export type Point = {
  x: number,
  y: number
}

export type Segment = {
  id: string,
  color: Color,
  start: Point,
  end: Point
  curveControl?: Point,
  startConnection?: string,
  endConnection?: string,
}