<template>
  <div>

    <Toolbar v-model:mode="selectedMode"></Toolbar>
    <svg ref="svg" viewBox="0 0 100 100"
         @click="bgClick"
         @mousemove="bgMouseMove"
         @mouseup="bgMouseUp"
         @mousedown="bgMouseDown"
    >

      <Ground :y="95" height="5"></Ground>

      <g v-if="drawingSegment.drawing">
        <line
            :x1="drawingSegment.startX" :x2="drawingSegment.endX"
            :y1="drawingSegment.startY" :y2="drawingSegment.endY"
            :stroke="drawingColor"
            stroke-width="1"
        ></line>
      </g>

      <template v-for="segment in segmentsArray">
        <Piece :segment="segment" @click="pieceClicked(segment)"></Piece>
      </template>

    </svg>
  </div>
</template>

<script lang="ts">
import {ref, reactive, defineComponent, provide, InjectionKey} from "vue"
import Toolbar, {Mode} from "./subcomponents/Toolbar.vue";
import Ground from "./subcomponents/Ground.vue";
import Piece from "./subcomponents/Piece.vue"

import {Color} from "@/model/segment-color";
import {Connection, Point, Segment} from "@/model/segment";
import {state, addSegment, removeSegment, moveEndpoint} from "@/state/game-file"

const selectedModeKey: InjectionKey<Mode> = Symbol();
const svgCoordsKey: InjectionKey<(clientX: number, clientY: number) => { x: number, y: number } | false> = Symbol();
const segmentStartKey: InjectionKey<(svgX: number, svgY: number, connection: Connection) => void> = Symbol();
const segmentSnapKey: InjectionKey<(svgX: number, svgY: number, connection: Connection) => void> = Symbol();
const snapRadiusKey: InjectionKey<number> = Symbol();

export const injections = {
  svgCoords: svgCoordsKey,
  segmentStart: segmentStartKey,
  segmentSnap: segmentSnapKey,
  snapRadius: snapRadiusKey,
  selectedMode: selectedModeKey
}

export default defineComponent({
  name: "GameCreator",
  components: {Piece, Toolbar, Ground},
  props: {
    snapRadius: {
      type: Number,
      default: 4
    }
  },
  setup: (props) => {
    const svg = ref();

    const drawingSegment = reactive({
      drawing: false,
      startConnection: undefined,
      snapping: false,
      endConnection: undefined,
      startX: -1, startY: -1,
      endX: -1, endY: -1,
    });

    const _updatingPoint = {
      moving: false,
      connection: {} as Connection,
      snapping: false,
      snapPoint: {} as Point | undefined,
    }
    const updatingPoint = reactive({});

    const stopMoving = () => {
      Object.assign(updatingPoint, _updatingPoint);
    }
    stopMoving();

    const svgCoords = (clientX: number, clientY: number) => {
      if (!svg.value) return false;
      const pt = svg.value.createSVGPoint();

      pt.x = clientX;
      pt.y = clientY;

      return pt.matrixTransform(svg.value.getScreenCTM().inverse());
    }

    const segmentStart = (svgX: number, svgY: number, connection: Connection) => {
      if (selectedMode.value == Mode.Moving) {
        if (connection.id == "ground") return;
        updatingPoint.moving = true;
        updatingPoint.connection = connection;
        return;
      }

      drawingSegment.drawing = true;
      drawingSegment.startConnection = connection;
      drawingSegment.startX = drawingSegment.endX = svgX;
      drawingSegment.startY = drawingSegment.endY = svgY;
    }

    const segmentSnap = (svgX: number, svgY: number, connection: Connection) => {
      if (drawingSegment.drawing) {
        drawingSegment.snapping = true;
        drawingSegment.endX = svgX;
        drawingSegment.endY = svgY;
        drawingSegment.endConnection = connection;
        return;
      }
      if (updatingPoint.moving && (connection.id != updatingPoint.connection.id)) {
        updatingPoint.snapping = true
        updatingPoint.snapPoint = {x: svgX, y: svgY}
        moveEndpoint(updatingPoint.connection, updatingPoint.snapPoint, connection);
      }
    }

    const selectedMode = ref<Mode>(Mode.DrawingBlue);

    provide(svgCoordsKey, svgCoords);
    provide(segmentStartKey, segmentStart);
    provide(segmentSnapKey, segmentSnap);
    provide(snapRadiusKey, props.snapRadius);
    provide(selectedModeKey, selectedMode);

    const {segments} = state;

    return {
      selectedMode,
      segments,
      svg,
      svgCoords,
      drawingSegment,
      updatingPoint,
      stopMoving,
    }
  },
  computed: {
    segmentsArray() {
      return Object.values(this.segments);
    },
    drawingColor() {
      if (this.selectedMode == Mode.DrawingBlue) {
        return Color.Blue;
      }
      if (this.selectedMode == Mode.DrawingRed) {
        return Color.Red;
      }
      if (this.selectedMode == Mode.DrawingGreen) {
        return Color.Green;
      }
      return undefined;
    }
  },
  methods: {
    pieceClicked(segment: Segment) {
      if (this.drawingColor) {
        segment.color = this.drawingColor;
        return;
      }
      if (this.selectedMode == Mode.Deleting) {
        removeSegment(segment);
      }
    },
    bgClick(event: MouseEvent) {

    },

    bgMouseMove(event: MouseEvent) {

      const coords = this.svgCoords(event.clientX, event.clientY);

      const beyondSnap = (snapX: number, snapY: number) => Math.sqrt((coords.x - snapX) ** 2 + (coords.y - snapY) ** 2) > this.snapRadius;

      if (this.drawingSegment.drawing) {
        if (this.drawingSegment.snapping) {
          const {endX, endY} = this.drawingSegment;
          if (!beyondSnap(endX, endY)) return;
          this.drawingSegment.snapping = false;
          this.drawingSegment.endConnection = undefined;
        }
        this.drawingSegment.endX = coords.x;
        this.drawingSegment.endY = coords.y;
        return;
      }

      if (this.updatingPoint.moving) {

        if (this.updatingPoint.snapping) {
          const {x, y} = this.updatingPoint.snapPoint;
          if (!beyondSnap(x, y)) {
            return;
          }
          this.updatingPoint.snapping = false;
          this.updatingPoint.snapPoint = undefined;
        }
        moveEndpoint(this.updatingPoint.connection,
            {x: coords.x, y: coords.y})
      }
    },

    bgMouseUp(event: MouseEvent) {
      if (this.updatingPoint.moving) {
        this.stopMoving();
      }
      if (!this.drawingSegment.drawing) return;
      if (this.drawingColor) {
        const {startX, startY, endX, endY, startConnection, endConnection} = this.drawingSegment;
        const xDiff = endX - startX;
        const yDiff = endY - startY;
        const id = "segment" + this.segmentsArray.length;
        const newSegment: Segment = {
          id,
          color: this.drawingColor,
          start: {
            x: startX,
            y: startY
          },
          end: {
            x: endX,
            y: endY
          },
          curveControlStart: {
            x: startX + xDiff / 3,
            y: startY + yDiff / 3
          },
          curveControlEnd: {
            x: endX - xDiff / 3,
            y: endY - yDiff / 3
          },
          startConnection: startConnection ? [startConnection] : [],
          endConnection: endConnection ? [endConnection] : []
        };

        addSegment(newSegment);

        this.drawingSegment.drawing = false;
        this.drawingSegment.startConnection = undefined;
        this.drawingSegment.endConnection = undefined;
      }

    },

    bgMouseDown(event: MouseEvent) {

    }
  },
  data() {
    return {}
  }
})
</script>

<style scoped>
svg {
  width: 600px;
  height: 600px;
  border: 1px solid black;
}
</style>