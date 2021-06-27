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
        <Piece :segment="segment"></Piece>
      </template>

    </svg>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, provide, InjectionKey} from "vue"
  import Toolbar, { Mode } from "./subcomponents/Toolbar.vue";
  import Ground from "./subcomponents/Ground.vue";
  import Piece from "./subcomponents/Piece.vue"

  import {Color} from "@/model/segment-color";
  import {Connection, Segment} from "@/model/segment";
  import {state, addSegment} from "@/state/game-file"

  const svgCoordsKey: InjectionKey<(clientX: number, clientY: number) => {x: number, y: number} | false> = Symbol();
  const segmentStartKey: InjectionKey<(svgX: number, svgY: number) => void> = Symbol();
  const segmentSnapKey: InjectionKey<(svgX: number, svgY: number) => void> = Symbol();
  const snapRadiusKey: InjectionKey<number> = Symbol();

  export const injections = {
    svgCoords: svgCoordsKey,
    segmentStart: segmentStartKey,
    segmentSnap: segmentSnapKey,
    snapRadius: snapRadiusKey
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

      const svgCoords = (clientX: number, clientY: number) => {
        if (!svg.value) return false;
        const pt = svg.value.createSVGPoint();

        pt.x = clientX;
        pt.y = clientY;

        return pt.matrixTransform( svg.value.getScreenCTM().inverse() );
      }

      const segmentStart = (svgX: number, svgY: number, connection: Connection) => {
        drawingSegment.drawing = true;
        drawingSegment.startConnection = connection;
        drawingSegment.startX = drawingSegment.endX = svgX;
        drawingSegment.startY = drawingSegment.endY = svgY;
      }
1
      const segmentSnap = (svgX: number, svgY: number, connection: Connection) => {
        if (drawingSegment.drawing) {
          drawingSegment.snapping = true;
          drawingSegment.endX = svgX;
          drawingSegment.endY = svgY;
          drawingSegment.endConnection = connection;
        }
      }

      provide(svgCoordsKey, svgCoords);
      provide(segmentStartKey, segmentStart);
      provide(segmentSnapKey, segmentSnap);
      provide(snapRadiusKey, props.snapRadius);

      const {segments} = state;

      return {
        segments,
        addSegment,
        svg,
        svgCoords,
        drawingSegment
      }
    },
    computed: {
      segmentsArray () {
        return Object.values(this.segments);
      },
      drawingColor () {
        if (this.selectedMode == Mode.DrawingBlue) {
          return Color.Blue;
        }
        if (this.selectedMode == Mode.DrawingRed) {
          return Color.Red;
        }
        if (this.selectedMode == Mode.DrawingGreen) {
          return Color.Green;
        }
      }
    },
    methods: {
      bgClick (event: MouseEvent) {
        console.log("click");
      },
      bgMouseMove (event: MouseEvent) {
        if (this.drawingSegment.drawing) {
          const coords = this.svgCoords(event.clientX, event.clientY);
          if (this.drawingSegment.snapping) {
            const { endX, endY } = this.drawingSegment;
            const distanceFromSnap = Math.sqrt((coords.x - endX)**2 + (coords.y - endY)**2);
            if (distanceFromSnap < this.snapRadius) {
              return;
            }
            this.drawingSegment.snapping = false;
            this.drawingSegment.endConnection = undefined;
          }
          this.drawingSegment.endX = coords.x;
          this.drawingSegment.endY = coords.y;
        }
      },

      bgMouseUp (event: MouseEvent) {
        if (this.drawingSegment.drawing) {
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

          console.log(this.segments);
          this.drawingSegment.drawing = false;
          this.drawingSegment.startConnection = undefined;
          this.drawingSegment.endConnection = undefined;
        }
      },

      bgMouseDown (event: MouseEvent) {

      }
    },
    data () {
      return {
        selectedMode: Mode.DrawingBlue,
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