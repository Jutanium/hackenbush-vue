import {Connection, Segment} from "@/model/segment";
import {pointsEqual} from "@/model/segment";
import {Color} from "@/model/segment-color";
import {simplestBetween, stalkValue} from "@/model/stalk-math";
// import SubgameWorker from "./subgameWorker?worker";

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
  ground: SubgraphData[],
  subgameCache: { [id: string]: {value: number, segmentIds: string[]}}
}

export type SegmentsMap = { [id: string]: Segment };
export type Graph = {
  removeEdge: (segmentId: string) => string[],
  graphData: GraphData,
  getLiveSegments: () => SegmentsMap,
  evaluate: () => number,
  getCurrentSubgraph: () => string,
  setSubgraph: (idString: string) => Boolean,
  bestMoveForColor: (color: Color) => Segment,
}

export function buildGraph(segments: SegmentsMap, groundY: number): Graph {

  let liveSegments = Object.assign({}, segments);
  let ground: SubgraphData[] = [];
  let edgeMap: { [id: string]: Edge } = {}

  const subgameCache: {
    [idString: string]: {
      value: number,
      segmentIds: string[],
    }
  } = {}

  const graphData: GraphData = {
    ground, edgeMap, subgameCache
  }

  function getLiveSegments() { return liveSegments }

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

    const deletedSegments: string[] = [];
    Object.keys(liveSegments).forEach(id => {
      if (!reached.has(id)) {
        deletedSegments.push(id);
        delete liveSegments[id];
        delete edgeMap[id];
      }
    })
    return deletedSegments;
  }

  function removeEdge(segmentId: string): string[] {
    delete liveSegments[segmentId];
    return populate();
  }


  const idString = (segments: Segment[]) => segments
    .map(s => s.id)
    .sort((a, b) => a.localeCompare(b))
    .join("")
    .replace(/\D/g, '');

  function getCurrentSubgraph() {
    return idString(Object.values(liveSegments));
  }

  function setSubgraph(idString: string | "all") {

    if (idString == "all") {
      liveSegments = Object.assign({}, segments);
      populate();
    }

    if (idString in subgameCache) {
      liveSegments = subgameCache[idString].segmentIds.reduce((acc: SegmentsMap, id) => {
        acc[id] = segments[id];
        return acc;
      }, {})
      populate();
      return true;
    }
    return false;
  }

  function evaluateWithout(id: string, segments: SegmentsMap) {
    const clone = Object.assign({}, segments);
    delete clone[id];
    const segmentList = Object.values(clone);
    const key = idString(segmentList);
    if (key in subgameCache) {
      return subgameCache[key].value;
    }
    const game = buildGraph(clone, groundY);
    const value = evaluate(game.graphData);
    subgameCache[key] = { value, segmentIds: segmentList.map(s => s.id) };
    return value;
  }

  function possibleMoves(color: Color, segments: SegmentsMap): Array<{ remove: Segment, value: number }> {
    return Object.values(segments).filter(s => s.color == color)
      .map(segment => ({remove: segment, value: evaluateWithout(segment.id, segments)}))
      .sort((a, b) => (a.value - b.value));
  }

  function evaluateSubgame(subgame: SubgraphData): number {
    const segments = Object.fromEntries(subgame.ids.map(id => [id, liveSegments[id]]));
    const segmentsArray = Object.values(segments);
    const key = idString(segmentsArray);
    if (key in subgameCache) {
      return subgameCache[key].value;
    }
    if (subgame.isStalk) {
      const value = stalkValue(segmentsArray);
      subgameCache[key] = {
        segmentIds: segmentsArray.map(s => s.id),
        value
      }
      return value;
    }

    const [leftMoveValues, rightMoveValues] = [Color.Blue, Color.Red]
      .map(color => possibleMoves(color, segments).map(({value}) => value));

    return simplestBetween(leftMoveValues[leftMoveValues.length - 1], rightMoveValues[0]);
  }

  function evaluate(graph: GraphData = graphData): number {
      // const worker = new SubgameWorker();
      //
      // worker.postMessage(graph.ground);
      //
      // worker.onmessage = ev => {
      //   console.log("recieved", ev.data);
      // }
      return graph.ground.reduce((acc, curr) => acc + evaluateSubgame(curr), 0);
  }

  function bestMoveForColor(color: Color): Segment {
    const moves = possibleMoves(color, liveSegments);
    if (color == Color.Blue) {
      return moves[moves.length - 1].remove;
    }
    return moves[0].remove;
  }

  return {
    removeEdge, graphData, getLiveSegments, evaluate, bestMoveForColor, getCurrentSubgraph, setSubgraph
  }
}