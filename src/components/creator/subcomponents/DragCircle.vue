<template>
  <g>
    <circle :cx="x" :cy="y" :r="radius"  @mousedown="onMouseDown"></circle>
  </g>
</template>

<script lang="ts">
  import { ref, PropType, inject, defineComponent } from "vue"
  import { injections } from "../GameCreator.vue"
  import {Connection} from "@/model/segment";

  export default defineComponent({
    name: "DragCircle",
    props: {
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      connection: {
        type: Object as PropType<Connection>,
        required: true,
      },
      radius: {
        type: Number,
        default: 1
      }
    },
    setup: () => {
      return {
        connectionPressed: inject(injections.connectionPressed),
        snapRadius: inject(injections.snapRadius)
      }
    },
    methods: {
      onMouseDown(e: MouseEvent): void {
        if (this.connectionPressed) {
          this.connectionPressed(this.x, this.y, this.connection, e.ctrlKey);
        }
      }
    }
  })
</script>

<style scoped>
 g {
   pointer-events: bounding-box;
 }
</style>