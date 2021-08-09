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

export type Graph = {
  removeEdge: (segmentId: string) => void,
  graphData: GraphData,
  liveSegments: { [id: string]: Segment }
}

export function buildGraph(segments: { [id: string]: Segment }, groundY: number) {

  let liveSegments = Object.assign({}, segments);
  let ground: Edge[] = [];
  let edgeMap: { [id: string]: Edge } = {}

  populate();

  function populate() {
    const segmentsArray = Object.values(liveSegments);

    ground.splice(0, ground.length);
    const reached = new Set();

    const segmentAtGround = (segment: Segment) => segment.start.y == groundY || segment.end.y == groundY;
    const buildUp = (segment: Segment) => {
      if (segment.id == "ground" || reached.has(segment.id)) {
        return;
      }

      const notMe = segmentsArray.filter(s => s.id != segment.id);
      const connections = notMe.filter(s =>
        pointsEqual(segment.start, s.start) ||
        pointsEqual(segment.start, s.end) ||
        pointsEqual(segment.end, s.start) ||
        pointsEqual(segment.end, s.end)
      );

      const edge = {
        segmentId: segment.id,
        connections: connections.map(s => s.id),
      }

      if (segmentAtGround(segment)) {
        edge.connections.push("ground");
      }

      edgeMap[segment.id] = edge;
      reached.add(segment.id);

      connections.forEach(buildUp);
    }

    for (const segment of segmentsArray) {
      if (segmentAtGround(segment) && !reached.has(segment.id)) {
        buildUp(segment);
        ground.push(edgeMap[segment.id]);
      }
    }

    Object.keys(liveSegments).forEach(id => {
      if (!reached.has(id)) {
        delete liveSegments[id];
        delete edgeMap[id];
      }
    })
  }


  function removeEdge(segmentId: string) {
    delete liveSegments[segmentId];
    populate();
  }

  const graphData: GraphData = {
    ground, edgeMap
  }

  return {
    removeEdge,
    graphData,
    liveSegments
  }

}

