<template>
  <g @mouseover="onMouseOver">
    <circle :cx="x" :cy="y" :r="snapRadius" opacity="0"></circle>
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
        segmentSnap: inject(injections.segmentSnap),
        snapRadius: inject(injections.snapRadius)
      }
    },
    methods: {
      onMouseOver () {
        if (this.segmentSnap && this.x && this.y) {
          console.log("snapping")
          this.segmentSnap(this.x, this.y, this.connection);
        }
      }
    },
    data () {
      return {

      }
    },
  })
</script>

<style scoped>
 g {
   pointer-events: bounding-box;
 }
</style>