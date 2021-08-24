<template>
  <g>

    <DrawnGround :width="width" :height="height" :y="y"/>

    <g @mousemove="onMouseMove" @mouseleave="onMouseLeave">

      <rect class="hoverSensitive"
            :width="width" :height="3" :y="y-1.5"
            opacity="0">

      </rect>

      <DragCircle v-if="circleX"
                  :x="circleX" :y="y"
                  :connection="connection" fill="black" z-index="10" />
    </g>

  </g>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue"
import {injections} from "../GameCreator.vue"
import DragCircle from "./DragCircle.vue";
import {Connection} from "@/model/segment";
import DrawnGround from "@/components/shared/DrawnGround.vue";

export default defineComponent({
    name: "Ground",
    components: {DrawnGround, DragCircle},
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
      const svgCoords = inject(injections.svgCoords);
      return {
        svgCoords
      }
    },
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
        connection: {
          id: "ground",
          side: "end"
        } as Connection,
        circleX: false as number | false,
      }
    }
  })
</script>

<style>
  rect.dragFrom {
    fill: black;
  }

</style>