import {Connection, Segment} from "@/model/segment";
import {pointsEqual} from "@/model/segment";
import {Color} from "@/model/segment-color";
import {simplestBetween, stalkValue} from "@/model/stalkMath";

type Edge = {
  segmentId: string,
  connections: Array<string | "ground">,
}

type EdgeMap = {
  [id: string]: Edge
}

type SubgraphData = {
  ids: string[],
  isStalk: boolean
}

type GraphData = {
  edgeMap: EdgeMap,
  ground: SubgraphData[]
}

type SegmentsMap = { [id: string]: Segment };
export type Graph = {
  removeEdge: (segmentId: string) => void,
  graphData: GraphData,
  liveSegments: SegmentsMap,
  evaluate: () => number,
}

export function buildGraph(segments: SegmentsMap, groundY: number) {

  let liveSegments = Object.assign({}, segments);
  let ground: SubgraphData[] = [];
  let edgeMap: { [id: string]: Edge } = {}

  const graphData: GraphData = {
    ground, edgeMap
  }
  const self: Graph = {
    removeEdge, graphData, liveSegments, evaluate
  }
  populate();

  function populate() {
    const segmentsArray = Object.values(liveSegments);

    ground.splice(0, ground.length);
    const reached = new Set();

    const segmentAtGround = (segment: Segment) => segment.start.y == groundY || segment.end.y == groundY;

    const buildUp = (segment: Segment, subgraph: SubgraphData = {ids: [], isStalk: true}) => {
      if (segment.id == "ground" || reached.has(segment.id)) {
        return subgraph;
      }

      const notMe = segmentsArray.filter(s => s.id != segment.id);
      const connections = notMe.filter(s =>
        pointsEqual(segment.start, s.start) ||
        pointsEqual(segment.start, s.end) ||
        pointsEqual(segment.end, s.start) ||
        pointsEqual(segment.end, s.end)
      );

      if (connections.length > 1) {
        subgraph.isStalk = false;
      }

      const edge = {
        segmentId: segment.id,
        connections: connections.map(s => s.id),
      }

      if (segmentAtGround(segment)) {
        edge.connections.push("ground");
      }

      edgeMap[segment.id] = edge;
      reached.add(segment.id);
      subgraph.ids.push(segment.id);

      connections.forEach(segment => buildUp(segment, subgraph));
      return subgraph;
    }

    for (const segment of segmentsArray) {
      if (segmentAtGround(segment) && !reached.has(segment.id)) {
        const subgraph = buildUp(segment);
        ground.push(subgraph);
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

  const subgameCache: { [idString: string]: number } = {}
  const idString = (segments: Segment[]) => segments
    .map(s => s.id)
    .sort((a, b) => a.localeCompare(b))
    .join("");

  function evaluate(graph: GraphData = graphData): number {

    const evaluateWithout = (id: string, segments: SegmentsMap) => {
      const clone = Object.assign({}, segments);
      delete clone[id];
      const key = idString(Object.values(clone));
      if (key in subgameCache) return subgameCache[key];
      const game = buildGraph(clone, groundY);
      const value = evaluate(game.graphData);
      subgameCache[key] = value;
      return value;
    }

    const evaluateSubgame = (subgame: SubgraphData): number => {
      const segments = Object.fromEntries(subgame.ids.map(id => [id, liveSegments[id]]));
      const segmentsArray = Object.values(segments);
      if (subgame.isStalk) {
        return stalkValue(segmentsArray);
      }

      const [leftMoveValues, rightMoveValues] = [Color.Blue, Color.Red].map(color => {
        const possibleMoves = segmentsArray.filter(s => s.color == color).map(s => s.id);
        return possibleMoves
          .map(id => evaluateWithout(id, segments))
          .sort((a,b) => (a - b));
      })

      return simplestBetween(leftMoveValues[leftMoveValues.length - 1], rightMoveValues[0]);
    }

    return graph.ground.reduce( (acc, curr) => acc + evaluateSubgame(curr), 0);
  }


  return self;

}

