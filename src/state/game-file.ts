
import type {Connection, Segment} from "@/model/segment";
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
  startConnection: [],
  endConnection: []
}

const segments = reactive<{ [id: string]: Segment}>({
  default: defaultSegment,
});

const groundConnections = reactive<Array<Connection>>([]);

export const state = {
  segments
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


  updateConnection({id, side: "start"}, segment.startConnection);
  updateConnection({id, side: "end"}, segment.endConnection);
}