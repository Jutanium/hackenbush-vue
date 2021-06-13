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
  import Toolbar from "./Toolbar.vue";
  import Ground from "./Ground.vue";

  const svgCoordsKey: InjectionKey<(clientX: number, clientY: number) => number> = Symbol();
  const segmentStartKey: InjectionKey<(svgX: number, svgY: number) => void> = Symbol();

  export const injections = {
    svgCoords: svgCoordsKey,
    segmentStart: segmentStartKey
  }

  export default defineComponent({
    name: "GameCreator",
    components: {Toolbar, Ground},
    props: {
    },
    setup: () => {
      const svg = ref();

      const drawingSegment = reactive({drawing: false, startX: -1, startY: -1, endX: -1, endY: -1});

      const svgCoords = (clientX: number, clientY: number) => {
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

      provide(svgCoordsKey, svgCoords);
      provide(segmentStartKey, segmentStart)

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
        drawing: false,
        someState: "hey"
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