
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

const segments = reactive<{ [id: string]: Segment}>({
});

const groundConnections = reactive<Array<Connection>>([]);

export const state = {
  segments,
  groundY: 95
}

function updateConnection(connectingFrom: Connection, connections: Connection[]) {
  connections.forEach(connection => {
    if (connection.id == "ground") {
      groundConnections.push(connectingFrom);
      return;
    }

    const updatingSegment = segments[connection.id];
    const updatingConnection = connection.side == "start" ? updatingSegment.startConnection : updatingSegment.endConnection;
    updatingConnection.push(connectingFrom);
  })
}

export function addSegment(segment: Segment) {
  const id = segment.id;
  segments[id] = segment;

  // updateConnection({id, side: "start"}, segment.startConnection);
  // updateConnection({id, side: "end"}, segment.endConnection);
}

export function removeSegment(segment: Segment | string) {
  const removeId = (typeof segment == "string") ? segment : segment.id;
  const toRemove = segments[removeId];
  // const filterOutThis = c => c.id != removeId;
  // [...toRemove.startConnection, ...toRemove.endConnection].forEach(({id}) => {
  //   const s = segments[id];
  //   if (s) {
  //     s.startConnection = s.startConnection.filter(filterOutThis);
  //     s.endConnection = s.endConnection.filter(filterOutThis);
  //   }
  // });
  delete segments[removeId];
}

// export function moveEndpoint(endpoint: Connection, point: Point, connectingTo?: Connection) {
//   const segmentToUpdate = segments[endpoint.id]
//   segmentToUpdate[endpoint.side] = point;
//   if (connectingTo) {
//     const newConnections = [connectingTo];
//     segmentToUpdate[endpoint.side + "Connection"] = newConnections
//     updateConnection(endpoint, newConnections);
//   } else {
//     segmentToUpdate[endpoint.side + "Connection"] = [];
//   }
// }

export function fileString() {
  const string = JSON.stringify(state)
  return string;
}