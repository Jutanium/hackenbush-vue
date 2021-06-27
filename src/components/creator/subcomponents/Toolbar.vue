<template>
  <div class="root">
    <ToolbarItem :selected="mode == 0"
                 color="red" @click="modeSelect(0)"></ToolbarItem>
    <ToolbarItem :selected="mode == 1"
                 color="blue" @click="modeSelect(1)"></ToolbarItem>
    <ToolbarItem :selected="mode == 2"
                 color="green" @click="modeSelect(2)"></ToolbarItem>
    <ToolbarItem :selected="mode == 3" @click="modeSelect(3)">
      <img :src="moveImg" alt="">
    </ToolbarItem>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue";
  import { Color } from "@/model/segment-color"
  import moveImg from "@/assets/move.png"

  import ToolbarItem from "./ToolbarItem.vue";

  export enum Mode {
    DrawingRed,
    DrawingBlue,
    DrawingGreen,
    Moving
  }

  export default defineComponent({
    name: "Toolbar",
    components: {ToolbarItem},
    emits: ["update:mode"],
    props: {
      mode: Number as PropType<Mode>
    },
    setup: () => {
    },
    methods: {
      modeSelect (mode: Mode) {
        this.$emit('update:mode', mode);
      }
    },
    data () {
      return {
        moveImg: moveImg
      }
    }
  })
</script>

<style scoped>
  div.root {
    display: flex;
  }
  img {
    width: 30px;
    height: 30px;
  }
</style>