import { GraphData } from "./graph";

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

export default function evaluate(graph: GraphData) {
    return graph.ground.reduce((acc, curr) => acc + evaluateSubgame(curr), 0);
}