<template>
  <div class="grid grid-cols-4 items-center gap-y-2 bg-white border bg-opacity-60 border-gray-200  p-2 rounded-md filter drop-shadow-md ">
    <template v-if="aiEnabled">
      <button class="col-span-2 text-md" :class="{'border-gray-400': twoPlayers}"
              @click="twoPlayers = true">
        2 Players
      </button>
      <button class="col-span-2 text-md" :class="{'border-gray-400': !twoPlayers}"
              @click="twoPlayers = false">
        Versus AI
      </button>
    </template>
    <template v-for="choice in Object.values(choices).filter(choice => choice.shown)" :key="choice">
      <div class="col-span-2 text-lg mr-2" v-text="choice.text"></div>
      <button :class="{'border-blue-400': choice.chosen == Color.Blue}"
              @click="choice.chosen = Color.Blue">
        <Blue :bold="choice.chosen == Color.Blue"/>
      </button>
      <button :class="{'border-red-400': choice.chosen == Color.Red}"
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
import {ref, defineComponent, PropType, reactive, computed} from "vue"
import {Color} from "@/model/segment-color";
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

type Player = Color.Red | Color.Blue

export default defineComponent({
  props: {
    aiEnabled: {
      type: Boolean,
      default: true
    },
    aiControls: {
      type: Array as PropType<Player[]>,
      default: [Color.Blue]
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

    const otherPlayer = (player: Player): Player => player == Color.Red ? Color.Blue : Color.Red;

    const twoPlayers = ref(!props.aiEnabled || props.aiControls.length == 0);

    const choices = reactive({
      playerControlled: {
        shown: computed(() => !twoPlayers.value), 
        text: "Play as:", 
        chosen: props.aiControls.length == 1 ? otherPlayer(props.aiControls[0]) : Color.Red},
      starting: {shown: true, text: "Who goes first?", chosen: props.starting}
    })

    const aiControls = computed(() => {
      if (twoPlayers.value) {
        return []
      }
      return [otherPlayer(choices.playerControlled.chosen)]
    })

    function playButtonClick() {
      emit("submit",  {aiControls: aiControls.value, starting: choices.starting.chosen})
    }

    return {
      twoPlayers,
      playButtonClick,
      choices,
      Color
    }
  },
})
</script>
<style> 
  button {
    @apply border-2 rounded-lg text-center border-transparent
  }
</style>
