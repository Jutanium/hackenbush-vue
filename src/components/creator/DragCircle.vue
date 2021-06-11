<template>
  <circle :cx="x" :cy="y" :r="radius"></circle>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
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
    },
    data () {
      return {

      }
    },
  })
</script>

<style scoped>

</style>