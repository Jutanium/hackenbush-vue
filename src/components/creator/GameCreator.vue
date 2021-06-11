<template>
  <div>

    <Toolbar></Toolbar>
    <svg ref="svg" viewBox="0 0 100 100"
         @click="bgClick"
         @mousemove="bgMouseMove"
         @mouseup="bgMouseUp"
         @mousedown="bgMouseDown"
    >

      <Ground :y="95" height="5"></Ground>

    </svg>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent, provide, InjectionKey} from "vue"
  import Toolbar from "./Toolbar.vue";
  import Ground from "./Ground.vue";

  const svgCoordsKey: InjectionKey<(clientX: number, number) => number> = Symbol();

  export const injections = {
    svgCoords: svgCoordsKey
  }

  export default defineComponent({
    name: "GameCreator",
    components: {Toolbar, Ground},
    props: {
    },
    setup: () => {
      const svg = ref(null);

      const svgCoords = (clientX: number, clientY: number) => {
        const pt = svg.value.createSVGPoint();

        pt.x = clientX;
        pt.y = clientY;

        return pt.matrixTransform( svg.value.getScreenCTM().inverse() );
      }

      provide(svgCoordsKey, svgCoords);

      return {
        svg
      }
    },
    methods: {
      bgClick (event: MouseEvent) {
        console.log("yo", this.svg)
      },
      bgMouseMove (event: MouseEvent) {

      },
      bgMouseUp (event: MouseEvent) {

      },
      bgMouseDown (event: MouseEvent) {

      }
    },
    data () {
      return {
        drawing: false,
        someState: "hey"
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