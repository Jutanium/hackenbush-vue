<template>
  <g class="root" @mouseleave="onMouseLeave" @mouseup="onMouseUp" @mousemove="onMouseMove"
    @mouseenter="onMouseEnter">

    <rect v-if="draggingCurveControl" :x="0" :y="0" :width="100" :height="100" :opacity="0"></rect>

    <PiecePath :segment="segment"
               :style="pathStyle"
       >
    </PiecePath>

    <transition name="fade">
      <g v-if="showingCurveControls">
        <line :x1="segment.start.x" :y1="segment.start.y" :x2="segment.curveControlStart.x" :y2="segment.curveControlStart.y"
              stroke-width="0.5" stroke="black" opacity="0.5"
              pointer-events="none"
        >
        </line>

        <line :x1="segment.end.x" :y1="segment.end.y" :x2="segment.curveControlEnd.x" :y2="segment.curveControlEnd.y"
              stroke-width="0.5" stroke="black" opacity="0.5"
              pointer-events="none"
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
    </transition>

    <DragCircle :x="segment.start.x" :y="segment.start.y" :connection="connections.start"></DragCircle>
    <DragCircle :x="segment.end.x" :y="segment.end.y" :connection="connections.end"></DragCircle>
  </g>
</template>

<script lang="ts">
  import { ref, defineComponent, PropType, inject } from "vue"
  import {Connection, Segment} from "@/model/segment"
  import DragCircle from "./DragCircle.vue";
  import { injections } from "@/components/creator/GameCreator.vue"
  import {Mode} from "@/components/creator/subcomponents/Toolbar.vue";
  import PiecePath from "@/components/shared/PiecePath.vue";

  export default defineComponent({
    name: "Piece",
    components: {DragCircle, PiecePath},
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true
      },
      demoMode: {
        type: Boolean,
        default: false
      }
    },
    setup: () => {
      const svgCoords = inject(injections.svgCoords);
      const selectedMode = inject(injections.selectedMode);
      return {
        selectedMode,
        svgCoords
      }
    },
    computed: {
      showingCurveControls (): Boolean {
        if (this.demoMode) {
          return false;
        }
        return this.selectedMode == Mode.Moving || (this.selectedMode < Mode.Deleting && this.mouseIsOver)
      },
      pathStyle () {
        if (this.selectedMode == Mode.Deleting && this.mouseIsOver) {
          return {
            opacity: 0.4,
          }
        }
        return {
          opacity: 1
        }
      },
      connections () {
        const id = this.segment.id;
        const start: Connection = {
          id,
          side: "start"
        }
        const end: Connection = {
          id,
          side: "end"
        }
        return {
          start,
          end
        }
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
      },
      onMouseEnter(e) {
        this.mouseIsOver = true;
      },
      onMouseLeave(e) {
        this.mouseIsOver = false;
      }
    },
    data () {
      return {
        mouseIsOver: false,
        draggingCurveControl: false as { x: number, y: number} | false,
      }
    }
  })
</script>

<style scoped>
g.root {
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>