import {Connection, Segment} from "@/model/segment";
import {pointsEqual} from "@/model/segment";

type Edge = {
  segmentId: string,
  connections: Array<string | "ground">,
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

  const edgeMap: { [id: string]: Edge } = {}

  const segmentAtGround = (segment: Segment) => segment.start.y == groundY || segment.end.y == groundY;
  const buildUp = (segment: Segment) => {
    // if (seen.has(segment.id)) {
    //   return;
    // }
    // seen.add(segment.id);
    if (segment.id == "ground" || segment.id in edgeMap) {
      return;
    }

    const notMe = segmentArray.filter(s => s.id != segment.id);
    const connections = notMe.filter(s =>
      pointsEqual(segment.start, s.start) ||
      pointsEqual(segment.start, s.end) ||
      pointsEqual(segment.end, s.start) ||
      pointsEqual(segment.end, s.end)
    );
    const edge = {
      segmentId: segment.id,
      connections: connections.map(s => s.id),
      out: connections.map(s => s.id)
    }
    if (segmentAtGround(segment)) {
      edge.connections.push("ground");
    }
    edgeMap[segment.id] = edge;
    connections.forEach(buildUp);
  }

  for (const segment of Object.values(segments)) {
    if (segmentAtGround(segment)) {
      buildUp(segment);
      ground.push(edgeMap[segment.id]);
    }
  }

  function reachesGround(segmentId: string) {
    const visited = new Set();
    const traverse = (edge: Edge) => {
      if (visited.has(edge.segmentId)) {
        return;
      }
      if (edge.segmentId == segmentId) {
        return true;
      }
      visited.add(edge.segmentId);
      const traverseNext = edge.connections
        .map((id: string) => id == "ground" ? false : edgeMap[id])
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
    touchesGround: reachesGround,
    removeEdge,
    graphData: {
      ground,
      edgeMap
    }

  }

}

