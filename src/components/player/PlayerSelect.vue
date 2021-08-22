<template>
  <div class="grid grid-cols-4 items-center gap-y-2 bg-white border border-gray-200  p-2 rounded-md filter drop-shadow-md ">
    <template v-for="choice in choices">
      <div class="col-span-2 text-lg mr-2" v-text="choice.text"></div>
      <button class="border-2 rounded-lg text-blue-player text-center border-transparent"
              :class="{'border-blue-400': choice.chosen == Color.Blue}"
              @click="choice.chosen = Color.Blue">
        bLue
      </button>
      <button class="border-2 rounded-lg text-red-player text-center border-transparent"
              :class="{'border-red-400': choice.chosen == Color.Red}"
              @click="choice.chosen = Color.Red">
        Red
      </button>
    </template>
    <div class="col-span-full flex items-center justify-center">
      <button
              @click="playButtonClick"
              class="h-12 px-6 m-2 text-lg text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600">
        Start
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType, reactive} from "vue"
import {Color} from "@/model/segment-color";

type Player = Color.Red | Color.Blue

export default defineComponent({
  props: {
    playerControlled: {
      type: String as PropType<Player>,
      default: Color.Blue
    },
    starting: {
      type: String as PropType<Player>,
      default: Color.Red
    },
  },
  // emits: ["update:starting", "update:playerControlled"],
  emits: ["submit"],
  setup: (props, {emit}) => {

    const {starting, playerControlled} = props;

    const choices = [
      reactive({text: "Play as:", chosen: playerControlled}),
      reactive({text: "Who goes first?", chosen: starting})
    ]

    function playButtonClick() {
      emit("submit",  {playerControlled: choices[0].chosen, starting: choices[1].chosen})
    }

    return {
      playButtonClick,
      choices,
      Color
    }
  },
})
</script>
