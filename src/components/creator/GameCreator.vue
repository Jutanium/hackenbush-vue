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

      <g v-if="isDrawing">
        <PiecePath :segment="newSegment"></PiecePath>

      </g>

      <template v-for="segment in segmentsArray">
        <Piece :segment="segment" @click="pieceClicked(segment)"></Piece>
      </template>

    </svg>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, InjectionKey, provide, reactive, Ref, ref, unref} from "vue"
import Toolbar, {Mode} from "./subcomponents/Toolbar.vue";
import Ground from "./subcomponents/Ground.vue";
import Piece from "./subcomponents/Piece.vue"
import PiecePath from "@/components/shared/PiecePath.vue";

import {Color} from "@/model/segment-color";
import {Connection, Point, Segment} from "@/model/segment";
import {addSegment, removeSegment, state} from "@/components/creator/state/game-file"

const selectedModeKey: InjectionKey<Ref<Mode>> = Symbol();
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
  components: {Piece, Toolbar, Ground, PiecePath},
  props: {
    snapRadius: {
      type: Number,
      default: 4
    }
  },
  setup: (props) => {
    const svg = ref();

    const {segments} = state;

    // const _updatingPoint = {
    //   moving: false,
    //   connection: {} as Connection,
    //   snapping: false,
    //   snapPoint: {} as Point | undefined,
    // }

    const selectedMode = ref<Mode>(Mode.DrawingBlue);

    const drawingColor = computed( () => {
      const mode = unref(selectedMode);
      switch (mode) {
        case Mode.DrawingBlue:
          return Color.Blue;
        case Mode.DrawingRed:
          return Color.Red;
        case Mode.DrawingGreen:
          return Color.Green;
      }
      return undefined;
    });

    const isDrawing = ref(false);

    const _newSegment = {
      id: "",
      color: Color.Blue,
      start: {x: -1, y:-1},
      end: {x: -1, y:-1},
    };

    const newSegment = reactive<Segment>(_newSegment);

    const movingPoint = reactive({
      snapping: false,
      point: false as Point | false,
      connection: {} as Connection
    });

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
        movingPoint.snapping = false;
        movingPoint.point = segments[connection.id][connection.side];
        movingPoint.connection = connection;
        return;
      }

      if (drawingColor.value) {
        isDrawing.value = true;
        newSegment.color = drawingColor.value;
        newSegment.start = {x: svgX, y: svgY};
        newSegment.end = {x: svgX, y: svgY};
        movingPoint.point = newSegment.end;
      }
    }

    const segmentSnap = (svgX: number, svgY: number, connection: Connection) => {
      if (movingPoint.point) {
        if (connection.id == movingPoint.connection.id && connection.side == movingPoint.connection.side)
          return;
        movingPoint.point.x = svgX;
        movingPoint.point.y = svgY;
        movingPoint.snapping = true;
      }
    }


    provide(svgCoordsKey, svgCoords);
    provide(segmentStartKey, segmentStart);
    provide(segmentSnapKey, segmentSnap);
    provide(snapRadiusKey, props.snapRadius);
    provide(selectedModeKey, selectedMode);


    return {
      selectedMode,
      segments,
      svg,
      svgCoords,
      newSegment,
      isDrawing,
      movingPoint,
      drawingColor
    }
  },
  computed: {
    segmentsArray(): Segment[] {
      return Object.values(this.segments);
    },
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

      const beyondSnap = (point: Point) =>
        Math.sqrt((coords.x - point.x) ** 2 + (coords.y - point.y) ** 2) > this.snapRadius;

      if (this.movingPoint.point) {
        if (this.movingPoint.snapping) {
          if (!beyondSnap(this.movingPoint.point)) {
            return;
          }
          this.movingPoint.snapping = false;
        }
        this.movingPoint.point.x = coords.x;
        this.movingPoint.point.y = coords.y;
      }
    },

    bgMouseUp(event: MouseEvent) {
      if (this.movingPoint.point) {
        this.movingPoint.point = false;
      }

      if (this.isDrawing) {
        const {start, end} = this.newSegment
        const xDiff = end.x - start.x;
        const yDiff = end.y - start.y;
        const id = "segment" + Date.now() % 100 + this.counter++;

        addSegment(Object.assign({}, this.newSegment, {
          id,
          color: this.drawingColor,
          curveControlStart: {
            x: start.x + xDiff / 3,
            y: start.y + yDiff / 3
          },
          curveControlEnd: {
            x: end.x - xDiff / 3,
            y: end.y - yDiff / 3
          },
        }));


        this.isDrawing = false;
      }

    },

    bgMouseDown(event: MouseEvent) {

    }
  },
  data() {
    return {
      counter: 0,
    }
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