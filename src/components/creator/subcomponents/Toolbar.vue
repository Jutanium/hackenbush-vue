<template>
  <div class="flex w-full justify-between items-center">
    <div class="flex">
      <ToolbarItem :selected="mode == 0"
                   color="red" @click="modeSelect(0)"></ToolbarItem>
      <ToolbarItem :selected="mode == 1"
                   color="blue" @click="modeSelect(1)"></ToolbarItem>
      <!--    <ToolbarItem :selected="mode == 2"-->
      <!--                 color="green" @click="modeSelect(2)"></ToolbarItem>-->
      <ToolbarItem :selected="mode == 3" @click="modeSelect(3)">
        <img :src="img.move" alt="">
      </ToolbarItem>
      <ToolbarItem :selected="mode == 4" @click="modeSelect(4)">
        <img :src="img.eraser" alt="">
      </ToolbarItem>
    </div>
    <RoundedButton @click="$emit('exportClick')" class="w-32">Export Game</RoundedButton>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue";
import {Color} from "@/model/segment-color"
import moveImg from "@/assets/move.png"
import eraserImg from "@/assets/eraser.png"

import ToolbarItem from "./ToolbarItem.vue";
import RoundedButton from "@/components/shared/RoundedButton.vue";


export enum Mode {
  DrawingRed,
  DrawingBlue,
  DrawingGreen,
  Moving,
  Deleting,
}

export default defineComponent({
  name: "Toolbar",
  components: {RoundedButton, ToolbarItem},
  emits: ["update:mode", "exportClick"],
  props: {
    mode: Number as PropType<Mode>
  },
  setup: () => {
  },
  methods: {
    modeSelect(mode: Mode) {
      this.$emit('update:mode', mode);
    },
  },
  data() {
    return {
      img: {
        move: moveImg,
        eraser: eraserImg
      }
    }
  }
})
</script>

<style scoped>
img {
  width: 30px;
  height: 30px;
}

a {
  text-decoration: none;
  font-family: Cambria
}

a:hover {
  color: green;
}
</style>