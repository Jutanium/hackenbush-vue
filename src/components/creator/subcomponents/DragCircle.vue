<template>
  <circle :cx="x" :cy="y" :r="radius" @mouseover="segmentSnap(x,y)" @mousedown="segmentStart(x, y)"></circle>
</template>

<script lang="ts">
  import { ref, inject, defineComponent } from "vue"
  import { injections } from "../GameCreator.vue"

  export default defineComponent({
    name: "DragCircle",
    props: {
      x: Number,
      y: Number,
      radius: {
        type: Number,
        default: 1
      }
    },
    setup: () => {
      return {
        segmentStart: inject(injections.segmentStart),
        segmentSnap: inject(injections.segmentSnap)
      }
    },
    data () {
      return {

      }
    },
  })
</script>

<style scoped>

</style>