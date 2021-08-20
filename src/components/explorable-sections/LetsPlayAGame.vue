<template>
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
    <template v-slot:sticky="{current, progress, direction}">
      {{current}} {{progress}} {{direction}}
      <div class="w-3/4">
        <GamePlayer :segments="person.segments"
                    v-model:subgraph="subgraph"
                    :autoplay="3"
                    :ai="[Color.Red, Color.Blue]"
                    :starting-player="Color.Blue"
                    :show-turn="false"
                    :segments-opacity="segmentOpacity(current, progress)"
                    :scissors-opacity="scissorsOpacity(current, progress)"
                    :scissors-offset-y="current == 0 ? (300 + (progress * -300)) : undefined"
                    ref="player"
        >
        </GamePlayer>
      </div>
    </template>
  </ScrollytellSection>
</template>

<script setup>
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import person from "@/game-files/person.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"

const segmentOpacity = (current, progress) => {
  if (current < 1) {
    return 0;
  }
  if (current == 1) {
    return progress;
  }
}
const scissorsOpacity = (current, progress) => {
  if (current < 0) {
    return 0;
  }
  if (current == 0) {
    return 0.5 + progress / 2;
  }
  return 1;
}

const subgraph = ref("all");

</script>

<style scoped>

</style>