<template>
  <div>
    <LetsPlayAGame></LetsPlayAGame>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import ScrollytellSection from "@/components/scrollytell/ScrollytellSection.vue";
  import GamePlayer from "@/components/player/GamePlayer.vue";
  import square from "@/game-files/square.json"
  import dog from "@/game-files/dog.json"
  import Scissors from "@/components/player/Scissors.vue";
  import {Color} from "@/model/segment-color";
  import LetsPlayAGame from "@/components/explorable-sections/LetsPlayAGame.vue";

  export default defineComponent({
    components: {LetsPlayAGame, Scissors, ScrollytellSection, GamePlayer},
    props: {
    },
    setup: () => {
    },
    data () {
      return {
        square,
        dog,
        Color
      }
    },
  })
</script>

<style scoped>

</style>