<template>
  <div>
    <ScrollytellSection :num-groups="7">
      <template v-slot:group1>
        <b>Let's play a game.</b>
      </template>
      <template v-slot:group2>
        It’s a simple game, with two players — bLue and Red.
      </template>
      <template v-slot:group3>
        The game consists of a bunch of bLue and Red strings connected to the ground.
      </template>
      <template v-slot:group4>
        Each player, on their turn, can cut a string of their own color.
      </template>
      <template v-slot:group5>
        Any pieces that are no longer connected to the ground will float away.
      </template>
      <template v-slot:group6>
        If you can’t make a move, you lose.
      </template>
      <template v-slot:group7>
        That’s it — those are the only rules. Try it out!
      </template>
      <template v-slot:sticky="{current, progress}">
        <div class="w-3/4">
          <GamePlayer :segments="dog.segments" :puppet-mode="false"
                      :ai="[Color.Blue, Color.Red]"
                      :show-turn="true" :starting-player="Color.Blue"></GamePlayer>
        </div>
      </template>
    </ScrollytellSection>
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

  export default defineComponent({
    components: {Scissors, ScrollytellSection, GamePlayer},
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