<template>
  <circle :cx="x" :cy="y" :r="radius" @mousedown="segmentStart(x, y)"></circle>
</template>

<script lang="ts">
  import { ref, inject, defineComponent } from "vue"
  import { injections } from "./GameCreator.vue"

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
        segmentStart: inject(injections.segmentStart)
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