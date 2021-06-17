<template>
  <g @mouseup="onMouseUp" @mousemove="onMouseMove">
    <path fill="none" :d="path" :stroke="segment.color" stroke-width="1"></path>
    <DragCircle :x="segment.start.x" :y="segment.start.y"></DragCircle>
    <DragCircle :x="segment.end.x" :y="segment.end.y"></DragCircle>


    <line :x1="segment.start.x" :y1="segment.start.y" :x2="segment.curveControlStart.x" :y2="segment.curveControlStart.y"
          stroke-width="0.5" stroke="black" opacity="0.5"
    >
    </line>

    <line :x1="segment.end.x" :y1="segment.end.y" :x2="segment.curveControlEnd.x" :y2="segment.curveControlEnd.y"
          stroke-width="0.5" stroke="black" opacity="0.5"
    >
    </line>

    <circle :cx="segment.curveControlStart.x" :cy="segment.curveControlStart.y" :r="1"
            fill="orange"
            @mousedown="draggingCurveControl = segment.curveControlStart"
    ></circle>

    <circle :cx="segment.curveControlEnd.x" :cy="segment.curveControlEnd.y" :r="1"
            fill="turquoise"
            @mousedown="draggingCurveControl = segment.curveControlEnd"
    ></circle>
  </g>
</template>

<script lang="ts">
  import { ref, defineComponent, PropType, inject } from "vue"
  import { Segment } from "@/model/segment"
  import DragCircle from "./DragCircle.vue";
  import { injections } from "@/components/creator/GameCreator.vue"

  export default defineComponent({
    name: "Piece",
    components: {DragCircle},
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true
      }
    },
    setup: () => {
      const svgCoords = inject(injections.svgCoords);
      return {
        svgCoords
      }
    },
    computed: {
      path (): string {
        let path = `M ${this.segment.start.x},${this.segment.start.y}`
        if (this.segment.curveControlStart && this.segment.curveControlEnd) {
          const cS = this.segment.curveControlStart;
          const cE = this.segment.curveControlEnd;
          const end = this.segment.end;
          path += `C ${cS.x},${cS.y} ${cE.x},${cE.y} ${end.x},${end.y}`
        }
        path += `L ${this.segment.end.x},${this.segment.end.y}`
        return path;
      }
    },
    methods: {
      onMouseMove(e: MouseEvent) {
        if (this.draggingCurveControl && this.svgCoords) {
          const coords = this.svgCoords(e.clientX, e.clientY);
          if (coords) {
            this.draggingCurveControl.x = coords.x;
            this.draggingCurveControl.y = coords.y;
          }
        }
      },
      onMouseUp(e) {
        this.draggingCurveControl = false;
      }
    },
    data () {
      return {
        draggingCurveControl: false as { x: number, y: number} | false,
      }
    }
  })
</script>

<style scoped>
g {
  pointer-events: bounding-box;
}

</style>