<template>
  <div class="grid grid-cols-4 items-center gap-y-2 bg-white border border-gray-200  p-2 rounded-md filter drop-shadow-md ">
    <template v-for="choice in choices">
      <div class="col-span-2 text-lg mr-2" v-text="choice.text"></div>
      <button class="border-2 rounded-lg text-center border-transparent"
              :class="{'border-blue-400': choice.chosen == Color.Blue}"
              @click="choice.chosen = Color.Blue">
        <Blue :bold="choice.chosen == Color.Blue"/>
      </button>
      <button class="border-2 rounded-lg text-center border-transparent"
              :class="{'border-red-400': choice.chosen == Color.Red}"
              @click="choice.chosen = Color.Red">
        <Red :bold="choice.chosen == Color.Red"/>
      </button>
    </template>
    <div class="col-span-full flex items-center justify-center m-2">
      <BaseButton class="h-12" @click="playButtonClick">Start</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType, reactive} from "vue"
import {Color} from "@/model/segment-color";
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

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
  components: {BaseButton, Blue, Red},
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
