<template>
  <path fill="none"
        :d="path"
        pointer-events="visible"
        :class="colorClass"
        class="stroke-current stroke-4 lg:stroke-1"
  ></path>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue"
import {Segment} from "@/model/segment";
import {Color} from "@/model/segment-color";
  export default defineComponent({
    name: "",
    props: {
      segment: {
        type: Object as PropType<Segment>,
        required: true
      }
    },
    setup: () => {
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
      },
      colorClass () {
        if (this.segment.color == Color.Red) {
          return "text-red-player";
        }
        if (this.segment.color == Color.Blue) {
          return "text-blue-player";
        }
      }
    },
    data () {
      return {

      }
    },
  })
</script>

