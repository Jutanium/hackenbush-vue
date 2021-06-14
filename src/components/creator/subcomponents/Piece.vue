<template>
  <path fill="none" :d="path" :stroke="segment.color" stroke-width="1"></path>
  <DragCircle :x="segment.start.x" :y="segment.start.y"></DragCircle>
  <DragCircle :x="segment.end.x" :y="segment.end.y"></DragCircle>
  <circle :cx="segment.curveControl.x" :cy="segment.curveControl.y" :r="1"
          fill="orange"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
  ></circle>
</template>

<script lang="ts">
  import { ref, defineComponent, PropType, inject } from "vue"
  import { Segment } from "@/model/segment.ts"
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
        if (this.segment.curveControl) {
          const c = this.segment.curveControl;
          const s = this.segment.start;
          const e = this.segment.end;

          const xRadius = Math.sqrt(Math.pow(c.x - s.x, 2) + Math.pow(c.y - s.y, 2));
          const yRadius = Math.sqrt(Math.pow(c.x - e.x, 2) + Math.pow(c.y - e.y, 2));

          const angle = Math.atan2(c.y - s.y, c.x - s.x) * 180 / Math.PI;

          path += `A ${xRadius} ${yRadius} ${angle} 1 0 ${e.x} ${e.y}`
        } else {
          path += `L ${this.segment.end.x},${this.segment.end.y}`
        }
        return path;
      }
    },
    methods: {
      onMouseDown(e) {
        this.draggingCurve = true;
      },
      onMouseMove(e: MouseEvent) {
        const { x, y } = this.svgCoords(e.clientX, e.clientY);
        this.segment.curveControl.x = x;
        this.segment.curveControl.y = y;
      },
      onMouseUp(e) {
        this.draggingCurve = false;
      }
    },
    data () {
      return {
        draggingCurve: false,
      }
    }
  })
</script>

<style scoped>

</style>