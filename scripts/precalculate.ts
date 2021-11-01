const test: string = "hi";
import file from "../game-files/dog.json";

import { buildGraph } from "../src/model/graph"

const graph = buildGraph(file.segments, 95);
console.log(graph.evaluate());
console.log(graph);
// console.log(file);

