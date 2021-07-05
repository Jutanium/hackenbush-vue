import {Connection, Segment} from "@/model/segment";

type Edge = {
  segmentId: string,
  in: Array<string | "ground">,
  out: Array<string | "ground">
}

type EdgeMap = {
  [id: string]: Edge
}

type GraphData = {
  edgeMap: EdgeMap,
  ground: Edge[]
}


export function buildGraph(segments: { [id: string]: Segment }, groundY: number) {

  const segmentArray: Segment[] = Object.values(segments);

  const ground: Edge[] = [];

  const pointsEqual = (point1, point2) => point1.x == point2.x && point1.y == point1.y;

  const edgeMap: { [id: string]: Edge } = {}

  const buildUp = (segment: Segment) => {
    // if (seen.has(segment.id)) {
    //   return;
    // }
    // seen.add(segment.id);
    if (segment.id == "ground" || segment.id in edgeMap) {
      return;
    }

    const notMe = segmentArray.filter(s => s.id != segment.id);
    const ins = notMe.filter(s => pointsEqual(segment.start, s.start) || pointsEqual(segment.start, s.end));
    if (segment.start.y == groundY) {
      ins.push({id: "ground"});
    }
    const outs = notMe.filter(s => pointsEqual(segment.end, s.start) || pointsEqual(segment.end, s.end));
    if (segment.end.y == groundY) {
      outs.push({id: "ground"});
    }
    const edge = {
      segmentId: segment.id,
      in: ins.map(s => s.id),
      out: outs.map(s => s.id)
    }
    edgeMap[segment.id] = edge;
    ins.forEach(buildUp);
    outs.forEach(buildUp)
  }

  for (const segment of Object.values(segments)) {
    if (segment.start.y == groundY) {
      buildUp(segment);
      ground.push(edgeMap[segment.id]);
    }
  }

  function touchesGround(segmentId: string) {
    const visited = new Set();
    const traverse = edge => {
      if (visited.has(edge.segmentId)) {
        return;
      }
      if (edge.segmentId == segmentId) {
        return true;
      }
      visited.add(edge.segmentId);
      const traverseNext = [...edge.in, ...edge.out]
        .map(id => id == "ground" ? false : edgeMap[id])
        .filter(Boolean);
      for (const edge of traverseNext) {
        if (traverse(edge)) {
          return true;
        }
      }
      return false;
    }

    for (const edge of ground) {
      if (edge.segmentId in edgeMap) {
        if (traverse(edge)) {
          return true;
        }
      }
    }
    return false;
  }

  function removeEdge(segmentId: string) {
    delete edgeMap[segmentId];
  }

  return {
    touchesGround,
    removeEdge,
    graphData: {
      ground,
      edgeMap
    }

  }

}

