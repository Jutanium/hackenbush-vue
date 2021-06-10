<template>
  <div>

    <svg ref="svg" viewBox="0 0 100 100"
         @click="bgClick"
         @mousemove="bgMouseMove"
         @mouseup="bgMouseUp"
    >
    </svg>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  export default defineComponent({
    name: "GameCreator",
    props: {
    },
    setup: () => {
    },
    methods: {
      bgClick (event: MouseEvent) {

      },
      bgMouseMove (event: MouseEvent) {

      },
      bgMouseUp (event: MouseEvent) {

      }
    },
    data () {
      return {

      }
    }
  })
</script>

<style scoped>
  svg {
    width: 600px;
    height: 600px;
    border: 1px solid black;
  }
</style>