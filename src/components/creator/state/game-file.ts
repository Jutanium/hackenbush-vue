
import type {Connection, Point, Segment} from "@/model/segment";
import {ref, readonly, reactive} from "vue";
import {Color} from "@/model/segment-color";

const defaultSegment: Segment = {
  id: "default",
  start: {
    x: 20,
    y: 20,
  },
  end: {
    x: 50,
    y: 50,
  },
  curveControlStart: {
    x: 30,
    y: 30,
  },
  curveControlEnd: {
    x: 40,
    y: 40
  },
  color: Color.Blue,
}

type SegmentMap = { [id: string]: Segment};

const defaultSegments = {};

export function useGameState (initialSegments: SegmentMap | false) {
  let segments: SegmentMap = initialSegments ? reactive(initialSegments) : reactive(defaultSegments);

  const state = {
    segments,
    groundY: 95
  }

  function addSegment(segment: Segment) {
    const id = segment.id;
    segments[id] = segment;
  }

  function removeSegment(segment: Segment | string) {
    const removeId = (typeof segment == "string") ? segment : segment.id;
    delete segments[removeId];
  }

  function fileString() {
    const string = JSON.stringify(segments)
    return string;
  }

  return {
    state,
    addSegment,
    removeSegment,
    fileString
  }
}
