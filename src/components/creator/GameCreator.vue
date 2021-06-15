<template>
  <div>

    <Toolbar></Toolbar>
    <svg ref="svg" viewBox="0 0 100 100"
         @click="bgClick"
         @mousemove="bgMouseMove"
         @mouseup="bgMouseUp"
         @mousedown="bgMouseDown"
    >

      <Ground :y="95" height="5"></Ground>

      <Piece :segment="testSegment"></Piece>

      <g v-if="drawingSegment.drawing">
        <line
          :x1="drawingSegment.startX" :x2="drawingSegment.endX"
          :y1="drawingSegment.startY" :y2="drawingSegment.endY"
          stroke="black"
          stroke-width="1"
        ></line>
      </g>

    </svg>
  </div>
</template>

<script lang="ts">
  import { ref, reactive, defineComponent, provide, InjectionKey} from "vue"
  import Toolbar from "./subcomponents/Toolbar.vue";
  import Ground from "./subcomponents/Ground.vue";
  import Piece from "./subcomponents/Piece.vue"

  import {Color} from "@/model/segmentColor";
  import {Segment} from "@/model/segment";

  const svgCoordsKey: InjectionKey<(clientX: number, clientY: number) => {x, y}> = Symbol();
  const segmentStartKey: InjectionKey<(svgX: number, svgY: number) => void> = Symbol();
  const segmentSnapKey: InjectionKey<(svgX: number, svgY: number) => void> = Symbol();

  export const injections = {
    svgCoords: svgCoordsKey,
    segmentStart: segmentStartKey,
    segmentSnap: segmentSnapKey
  }

  export default defineComponent({
    name: "GameCreator",
    components: {Piece, Toolbar, Ground},
    props: {
    },
    setup: () => {
      const svg = ref();

      const drawingSegment = reactive({
        drawing: false,
        snapping: false,
        startX: -1, startY: -1,
        endX: -1, endY: -1,
        snapX: -1, snapY: -1
      });

      const svgCoords = (clientX: number, clientY: number): {x,y} => {
        if (!svg.value) return;
        const pt = svg.value.createSVGPoint();

        pt.x = clientX;
        pt.y = clientY;

        return pt.matrixTransform( svg.value.getScreenCTM().inverse() );
      }

      const segmentStart = (svgX: number, svgY: number) => {
        drawingSegment.drawing = true;
        drawingSegment.startX = drawingSegment.endX = svgX;
        drawingSegment.startY = drawingSegment.endY = svgY;
      }
1
      const segmentSnap = (svgX: number, svgY: number) => {
        console.log("snap")
        if (drawingSegment.drawing) {
          drawingSegment.snapping = true;
          drawingSegment.snapX = drawingSegment.endX = svgX;
          drawingSegment.snapY = drawingSegment.endY = svgY;
        }
      }

      provide(svgCoordsKey, svgCoords);
      provide(segmentStartKey, segmentStart);
      provide(segmentSnapKey, segmentSnap);

      return {
        svg,
        svgCoords,
        drawingSegment
      }
    },
    computed: {
    },
    methods: {
      bgClick (event: MouseEvent) {
        console.log("click");
      },
      bgMouseMove (event: MouseEvent) {
        if (this.drawingSegment.drawing) {
          const coords = this.svgCoords(event.clientX, event.clientY);
          if (this.drawingSegment.snapping) {
            const { snapX, snapY } = this.drawingSegment;
            const distanceFromSnap = Math.sqrt((coords.x - snapX)**2 + (coords.y - snapY)**2);
            if (distanceFromSnap < 3) {
              console.log(distanceFromSnap, snapX, this.drawingSegment.endX);
              return;
            }
            this.drawingSegment.snapping = false;
          }
          this.drawingSegment.endX = coords.x;
          this.drawingSegment.endY = coords.y;
        }
      },

      bgMouseUp (event: MouseEvent) {
        this.drawingSegment.drawing = false;
      },

      bgMouseDown (event: MouseEvent) {

      }
    },
    data () {
      return {
        testSegment: {
          start: {
            x: 20,
            y: 20
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
        } as Segment
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