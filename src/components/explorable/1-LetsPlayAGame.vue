<template>
  <ExplorableSection :num-groups="7" @slideChange="slideChange">

    <template v-slot:group0>
      <b>Let's play a game.</b>
    </template>

    <template v-slot:group1>
      It’s a simple game, with two players —
      <Blue/>
      and
      <Red/>
      .
    </template>

    <template v-slot:group2>
      The game consists of a bunch of
      <Blue/>
      and
      <Red/>
      <b> strings</b> connected to the <b>ground</b>.
    </template>

    <template v-slot:group3>
      Each player, on their turn, can <b>cut</b> a string of their own color.
    </template>

    <template v-slot:group4>
      Any pieces that are no longer connected to the ground will <b>float away.</b>
    </template>

    <template v-slot:group5>
      If you can’t make a move, you <b>lose</b>.
    </template>

    <template v-slot:group6>
      That’s it — those are the only rules. Try it out!
      <!--      <div v-if="playerWon !== undefined">-->
      <!--        <template v-if="playerWon">-->
      <!--          Hey, look — you won your first game! Great job!-->
      <!--        </template>-->
      <!--        <template v-else>-->
      <!--          You didn’t win this time, but don’t sweat it — you’ll have plenty more chances.-->
      <!--        </template>-->
      <!--      </div>-->
    </template>

    <template v-slot:sticky="{current, enterProgress, leaveProgress}">
      <GamePlayer
          :segments="person.segments"
          :subgraph="subgraph"
          :autoplay="autoplay"
          :flush="flushRef"
          :aiControls="aiControls(current)"
          :preventClick="current == 6 ? false : !hasCompleted"
          :starting-player="startingPlayer"
          :show-turn="current > 2"
          :reset-scissors-on-flush="true"
          :segments-opacity="blinkSegments || enterProgress"
          :scissors-opacity="Number(current >= 1)"
          :prompt-reset="{text: hasCompleted > 1 ? 'Play Again' : 'Let Me Play', choosePlayer: true, subgraph: 'all'}"
          @gameover="onGameOver"
      >
      </GamePlayer>
    </template>
  </ExplorableSection>
</template>

<script setup lang="ts">
import ExplorableSection from "@/components/explorable/ExplorableSection.vue";
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import person from "@/game-files/person.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import { gsap } from "gsap";

const subgraph = ref("all");
const autoplay = ref<boolean | number>(false);
const flushRef = ref(0);
const hasCompleted = ref(0);
const startingPlayer = ref();
const playerWon = ref<true | false | undefined>();

const aiControls = (current) => current == 6 ? [Color.Blue] : [Color.Red, Color.Blue];

const blinkSegments = ref(0)

function onGameOver({winner, playerDidWin, playingAgain}) {
  hasCompleted.value++;
  if (playingAgain) {
    playerWon.value = playerDidWin;
  }
}

function flush() {
  flushRef.value++;
}

function play() {
  autoplay.value = true;
  flush();
}

function reset() {
  autoplay.value = false;
  subgraph.value = "all";
  flush();
}


let blinking = null;

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  console.log("slideChange", current, direction);
  if (current <= 3 && direction < 0) {
    reset();
    return;
  }
  if (direction < 0) {
    autoplay.value = false;
    // flush();
  }
  if (current < 6) {
    startingPlayer.value = Color.Blue;
  }
  if (current == 2) {
    if (blinking) {
      blinking.restart();
      blinking.play();
    } else {
      blinking = gsap.fromTo(blinkSegments, { value: 1 }, { value: 0.2, yoyo: true, repeat: -2, duration: 1})
    }
  } else {
    if (blinking) {
      blinking.progress(1);
      blinking.pause();
      blinkSegments.value = 0;
    }
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