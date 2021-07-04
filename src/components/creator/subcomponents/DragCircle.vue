<template>
  <g>
    <circle :cx="x" :cy="y" :r="radius"  @mousedown="segmentStart(x, y, connection)"></circle>
  </g>
</template>

<script lang="ts">
  import { ref, PropType, inject, defineComponent } from "vue"
  import { injections } from "../GameCreator.vue"
  import {Connection} from "@/model/segment";

  export default defineComponent({
    name: "DragCircle",
    props: {
      x: Number,
      y: Number,
      connection: Object as PropType<Connection>,
      radius: {
        type: Number,
        default: 1
      }
    },
    setup: () => {
      return {
        segmentStart: inject(injections.segmentStart),
        snapRadius: inject(injections.snapRadius)
      }
    },
  })
</script>

<style scoped>
 g {
   pointer-events: bounding-box;
 }
</style>