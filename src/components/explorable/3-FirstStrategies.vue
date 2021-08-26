<template>
  <ExplorableSection :num-groups="5" @slideChange="slideChange">
    <template v-slot:group0="{enterProgress}">
      Suppose you’re
      <Blue/>, and it’s your move. What should you do?
      <div class="h-6"><i v-show="enterProgress == 1">Make your move!</i></div>
    </template>
    <template v-slot:group1="{current}">
      Well&hellip;I guess you really only have one choice, since there’s only one move you can make.
      Sometimes things are like that in life — there’s only one thing you can do.
      Likewise, if you’re <Red/>, you’ve got only one move to make at this point.
    </template>
    <template v-slot:group2>
      But what if it had been <Red/>'s turn to start off with? Now you have two options. What should you do?
    </template>
    <template v-slot:group3>
      Hopefully it seems reasonable to assume that each player wants to try to win the game. So, from now on, we’ll assume that
      <b>a player will always make the “best” move available to them.</b>
    </template>
    <template v-slot:group4>
      It may not always be obvious which move that is, though. We still have to figure out how to &hellip; well &hellip; figure that out.
    </template>
    <template v-slot:sticky="{current, enterProgress, direction}">
      <GamePlayer :segments="firststrat.segments"
                  :subgraph="subgraph"
                  :show-turn="enterProgress >= 1 && !preventClick"
                  :starting-player="startingPlayer"
                  :flush="flushRef"
                  :segments-opacity="enterProgress < 1 ? enterProgress : undefined"
                  :preventClick="preventClick"
                  @segmentClicked="onSegmentClicked"
                  :aiControls="aiControls"
                  :autoplay="true"
                  :promptReset="current >= 2 && {text: 'Reset'}"
      >

      </GamePlayer>
    </template>
  </ExplorableSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import firststrat from "@/game-files/firststrat.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import ExplorableSection from "@/components/explorable/ExplorableSection.vue";

const translateUp = (amount: number) => ({
  transform: `translateY(${-amount}px)`
})

const subgraph = ref("all");
const autoplay = ref<boolean | number>(false);
const flushRef = ref(0);
const hasCompleted = ref(0);
const startingPlayer = ref(Color.Blue);
const playerWon = ref<true | false | undefined>();

const segmentClicks = ref(0);
const currentSlide = ref(-1);

const preventClick = computed( () => {
  if (currentSlide.value < 1) {
    return segmentClicks.value >= 1
  }
});

const aiControls = computed ( () => currentSlide.value == 2 ? [Color.Blue] : [])


function onGameOver({winner, playerDidWin, playingAgain}) {
  hasCompleted.value++;
  if (playingAgain) {
    playerWon.value = playerDidWin;
  }
}

function onSegmentClicked({segment, player}) {
  segmentClicks.value++;
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
  segmentClicks.value = 0;
  flush();
}

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  currentSlide.value = current;
  console.log("slideChange", current, direction);
  // if (current < 1 && direction < 0) {
  //   reset();
  // }
  if (current == 0) {
    startingPlayer.value = Color.Blue;
    reset();
  }
  if (current == 1) {
    startingPlayer.value = Color.Red;
    subgraph.value = "32";
    flush();
  }
  if (current == 2) {
    startingPlayer.value = Color.Red;
    reset();
  }
  // if (direction < 0) {
  //   autoplay.value = false;
  //   // flush();
  // }
  // if (current < 6) {
  //   startingPlayer.value = Color.Blue;
  // }
  // if (current == 3) {
  //   subgraph.value = "all";
  //   if (direction > 0)
  //     autoplay.value = 4;
  //   flush();
  //   return;
  // }
  // if (current == 4) {
  //   subgraph.value = "3013424114154337507810986";
  //   if (direction > 0) {
  //     autoplay.value = 1;
  //   }
  //   flush();
  //   return;
  // }
  // if (current == 5) {
  //   subgraph.value = "3014157507810986"
  //   if (direction > 0) {
  //     autoplay.value = true;
  //   } else {
  //     autoplay.value = false;
  //   }
  //   flush();
  //   return;
  // }
  // if (current == 6) {
  //   if (direction < 0) {
  //     subgraph.value = "all"
  //     startingPlayer.value = "";
  //     flush();
  //   }
  // }
}

</script>

<style scoped>

</style>