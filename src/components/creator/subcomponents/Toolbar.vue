<template>
  <div class="flex w-full justify-between items-center">
    <div class="flex">
      <template v-if="!playing">
        <ToolbarItem :selected="mode == 0"
                     textColorClass="text-red-player" @click="modeSelect(0)"></ToolbarItem>
        <ToolbarItem :selected="mode == 1"
                     textColorClass="text-blue-player" @click="modeSelect(1)"></ToolbarItem>
           <ToolbarItem :selected="mode == 2"
                        textColorClass="text-green-500" @click="modeSelect(2)"></ToolbarItem> 
        <ToolbarItem :selected="mode == 3" @click="modeSelect(3)">
          <img :src="img.move" alt="">
        </ToolbarItem>
        <ToolbarItem :selected="mode == 4" @click="modeSelect(4)">
          <img :src="img.eraser" alt="">
        </ToolbarItem>
      </template>
    </div>
    <div class="flex gap-2">
      <RoundedButton @click="togglePlaying" class="px-4">{{!playing ? "Play" : "Edit"}}</RoundedButton>
      <RoundedButton @click="$emit('exportClick')" class="px-4">Export</RoundedButton>
    </div>
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
  emits: ["update:mode", "update:playing", "exportClick"],
  props: {
    mode: Number as PropType<Mode>,
    playing: Boolean
  },
  setup: () => {
  },
  methods: {
    modeSelect(mode: Mode) {
      this.$emit('update:mode', mode);
    },
    togglePlaying() {
      this.$emit('update:playing', !this.playing);
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