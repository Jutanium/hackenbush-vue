<template>

<!--  <div class="w-1/2">-->
<!--    <GamePlayer :segments="person.segments"-->
<!--                :subgraph="subgraph"-->
<!--                :autoplay="autoplay"-->
<!--                :ai="[Color.Blue]"-->
<!--                :starting-player="Color.Blue"-->
<!--                :show-turn="true"-->
<!--                :flush="flushRef"-->
<!--                ref="player"-->
<!--    />-->
<!--    <button @click="play">Play</button>-->
<!--    <button @click="reset">Reset</button>-->
<!--  </div>-->
    <ScrollytellSection :num-groups="7" @slideChange="slideChange">
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
        <GamePlayer :segments="person.segments"
                    :subgraph="subgraph"
                    :autoplay="autoplay"
                    :flush="flushRef"
                    :aiControls="current == 6 ? [Color.Blue] : [Color.Red, Color.Blue]"
                    :starting-player="startingPlayer"
                    :show-turn="current > 4"
                    :reset-scissors-on-flush="direction < 0"
                    :segments-opacity="segmentOpacity(current, progress)"
                    :scissors-opacity="scissorsOpacity(current, progress)"
                    :prompt-reset="{text: hasCompleted > 1 ? 'Play Again' : 'Let Me Play', choosePlayer: true}"
                    :scissors-offset-y="current == 0 ? (300 + (progress * -300)) : undefined"
                    @gameover="({winner}) => hasCompleted++"
                    ref="player"
        >
        </GamePlayer>
    </template>
  </ScrollytellSection>
</template>

<script setup lang="ts">
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
const autoplay = ref<boolean | number>(false);
const flushRef = ref(0);

function flush() {
  flushRef.value++;
}
function play () {
  autoplay.value = true;
  flush();
}

function reset() {
  autoplay.value = false;
  subgraph.value = "all";
  flush();
}

const hasCompleted = ref(0);

const startingPlayer = ref(Color.Blue);

const slideChange = (scrollData: {current: number, direction: number}) => {
  const { current, direction } = scrollData;
  console.log("slideChange", current, direction);
  if (current <= 3 && direction < 0) {
    reset();
    return;
  }
  if (direction < 0) {
    autoplay.value = false;
    // flush();
  }
  if (current == 3) {
    subgraph.value = "all";
    if (direction > 0)
      autoplay.value = 4;
    flush();
    return;
  }
  if (current == 4) {
    subgraph.value = "3013424114154337507810986";
    if (direction > 0) {
      autoplay.value = 1;
    }
    flush();
    return;
  }
  if (current == 5) {
    subgraph.value = "3014157507810986"
    if (direction > 0) {
      autoplay.value = true;
    } else {
      autoplay.value = false;
    }
    flush();
    return;
  }
  if (current == 6) {
    if (direction < 0) {
      subgraph.value = "all"
      startingPlayer.value = "";
      flush();
    }
  }
}

</script>

<style scoped>

</style>