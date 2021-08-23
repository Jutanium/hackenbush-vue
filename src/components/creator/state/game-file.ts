
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
  "segment220":{"id":"segment220","color":"blue","start":{"x":40.802677154541016,"y":95},"end":{"x":36.622074127197266,"y":79.93311309814453},"curveControlStart":{"x":39.4091428120931,"y":89.97770436604817},"curveControlEnd":{"x":38.01560846964518,"y":84.95540873209636}},"segment451":{"id":"segment451","color":"blue","start":{"x":36.622074127197266,"y":79.93311309814453},"end":{"x":12.374582290649414,"y":79.93311309814453},"curveControlStart":{"x":28.539576848347984,"y":79.93311309814453},"curveControlEnd":{"x":20.457079569498696,"y":79.93311309814453}},"segment463":{"id":"segment463","color":"blue","start":{"x":12.374582290649414,"y":79.93311309814453},"end":{"x":7.3578596115112305,"y":95},"curveControlStart":{"x":10.702341397603353,"y":84.95540873209636},"curveControlEnd":{"x":9.030100504557291,"y":89.97770436604817}},"segment224":{"id":"segment224","color":"blue","start":{"x":12.374582290649414,"y":79.93311309814453},"end":{"x":3.6789298057556152,"y":69.23076629638672},"curveControlStart":{"x":7.3578596115112305,"y":78.92976379394531},"curveControlEnd":{"x":4.682274341583252,"y":76.75585174560547}},"segment325":{"id":"segment325","color":"blue","start":{"x":36.622074127197266,"y":79.93311309814453},"end":{"x":36.45484924316406,"y":63.377925872802734},"curveControlStart":{"x":36.566332499186196,"y":74.41471735636394},"curveControlEnd":{"x":36.51059087117513,"y":68.89632161458333}},"segment956":{"id":"segment956","color":"blue","start":{"x":36.45484924316406,"y":63.377925872802734},"end":{"x":49.8327751159668,"y":72.74247741699219},"curveControlStart":{"x":38.12709045410156,"y":74.24748992919922},"curveControlEnd":{"x":38.294315338134766,"y":74.08026885986328}},"segment917":{"id":"segment917","color":"blue","start":{"x":36.45484924316406,"y":63.377925872802734},"end":{"x":49.8327751159668,"y":72.74247741699219},"curveControlStart":{"x":40.91415786743164,"y":66.49944305419922},"curveControlEnd":{"x":45.37346649169922,"y":69.6209602355957}},"segment628":{"id":"segment628","color":"red","start":{"x":61.03678894042969,"y":95},"end":{"x":64.38127136230469,"y":82.60869598388672},"curveControlStart":{"x":62.15161641438802,"y":90.86956532796223},"curveControlEnd":{"x":63.26644388834635,"y":86.73913065592448}},"segment319":{"id":"segment319","color":"red","start":{"x":64.38127136230469,"y":82.60869598388672},"end":{"x":85.11705780029297,"y":82.10702514648438},"curveControlStart":{"x":71.29320017496745,"y":82.44147237141927},"curveControlEnd":{"x":78.2051289876302,"y":82.27424875895183}},"segment5210":{"id":"segment5210","color":"red","start":{"x":85.11705780029297,"y":82.10702514648438},"end":{"x":89.13043212890625,"y":95},"curveControlStart":{"x":86.45484924316406,"y":86.40468343098958},"curveControlEnd":{"x":87.79264068603516,"y":90.7023417154948}},"segment7611":{"id":"segment7611","color":"red","start":{"x":64.38127136230469,"y":82.60869598388672},"end":{"x":62.87625503540039,"y":76.25418090820312},"curveControlStart":{"x":63.82385762532552,"y":80.49052429199219},"curveControlEnd":{"x":63.26644388834635,"y":78.37235260009766}},"segment5212":{"id":"segment5212","color":"red","start":{"x":62.87625503540039,"y":76.25418090820312},"end":{"x":62.87625503540039,"y":76.25418090820312},"curveControlStart":{"x":71.57190704345703,"y":56.85618591308594},"curveControlEnd":{"x":40.63545227050781,"y":79.43143463134766}},"segment7213":{"id":"segment7213","color":"red","start":{"x":85.11705780029297,"y":82.10702514648438},"end":{"x":98.3277587890625,"y":72.24079895019531},"curveControlStart":{"x":95.81939697265625,"y":80.93645477294922},"curveControlEnd":{"x":88.96321105957031,"y":64.04682159423828}}
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