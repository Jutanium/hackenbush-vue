<template>
  <ExplorableSection :topGap="true" :num-groups="7" @slideChange="slideChange" title="The Three Rules">
    <template v-slot:group0>
      We’re going to need to step things up a bit to be able to make sense of these games. Luckily, we’ve already developed a decent bit of intuition by playing a few games already!
    </template>
    <template v-slot:group1="">
      What we’re going to do could be said to be the true heart of mathematics:
      <div class="text-center">
        <b>Invent</b> some rules, <b>discover</b> their consequences.
      </div>
    </template>
    <template v-slot:group2>
      For the first part, we’re the ones in control! We decide what seems most important to us, what we like about our analysis we’ve done so far that we want to keep.
    </template>
    <template v-slot:group3>
      But then, once we’ve set those rules, the consequences spring forth out of nothing but pure, beautiful, mathematical logic.
    </template>
    <template v-slot:group4>
    </template>
    <template v-slot:group5>
    </template>
    <template v-slot:group6>
    </template>
    <template v-slot:sticky="{current, enterProgress, progress, direction}">
      <Billmoji class="w-3/4"></Billmoji>
<!--      <GamePlayer :segments="segments"-->
<!--                  :subgraph="subgraph"-->
<!--                  :show-turn="current >= 1 && current != 5"-->
<!--                  :starting-player="startingPlayer"-->
<!--                  :flush="flushRef"-->
<!--                  :preventClick="preventClick"-->
<!--                  @segmentClicked="onSegmentClicked"-->
<!--                  :aiControls="aiControls"-->
<!--                  :autoplay="autoplay"-->
<!--      >-->
<!--      </GamePlayer>-->
    </template>

  </ExplorableSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import dogcat from "@/game-files/dogcat.json"
import twocats from "@/game-files/twocats.json"
import onehalf from "@/game-files/small/onehalf.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import Purple from "@/components/explorable/text-elements/Purple.vue"
import ExplorableSection from "@/components/explorable/ExplorableSection.vue";
import Billmoji from "@/components/explorable/Billmoji.vue";

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
const hasCompleted = ref(0);


const playerWon = ref<true | false | undefined>();

const segmentClicks = ref(0);
const currentSlide = ref(-1);

// const startingPlayer = computed( () => {
//   if (curren < 0) {
//     return Color.Blue;
//   }
//   return undefined;
// })

const startingPlayer = ref(Color.Blue);

const segments = computed( () => {
  console.log("recomputing segments")
  if (currentSlide.value > 4) {
    return onehalf.segments;
  }
  if (currentSlide.value > 2) {
    return twocats.segments;
  }
  return dogcat.segments;
})

const preventClick = computed( () => {
  if (currentSlide.value < 1) {
    return segmentClicks.value >= 1
  }
});

const aiControls = ref( []);

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


}

</script>

<style scoped>

</style>
