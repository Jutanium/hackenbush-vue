<template>
  <g>
    <rect class="drawnGround"
          :width="width" :height="height" :y="y" fill="green">
    </rect>


    <g @mousemove="onMouseMove" @mouseleave="onMouseLeave">

      <rect class="hoverSensitive"
            :width="width" :height="3" :y="y-1.5"
            opacity="0">

      </rect>

      <DragCircle v-if="circleX" :x="circleX" fill="black" z-index="10" :y="y"/>
    </g>

  </g>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import DragCircle from "./DragCircle.vue";
  export default defineComponent({
    name: "Ground",
    components: {DragCircle},
    props: {
      height: {
        type: Number,
        default: 5,
      },
      width: {
        type: Number,
        default: 100
      },
      y: {
        type: Number,
        default: 95
      }
    },
    setup: () => {
    },
    inject: ['svgCoords'],
    methods: {
      onMouseMove(event: MouseEvent) {
        this.circleX = this.svgCoords(event.clientX, event.clientY).x;
      },
      onMouseLeave() {
        this.circleX = false;
      }
    },
    data () {
      return {
        circleX: false as number | false
      }
    }
  })
</script>

<style>
  rect.dragFrom {
    fill: black;
  }

</style>