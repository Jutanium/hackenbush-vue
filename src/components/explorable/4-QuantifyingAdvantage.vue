<template>
  <ScrollytellSection :topGap="true" :num-groups="7" @slideChange="slideChange">
    <template v-slot:group1>
      Now we’re starting to get a general strategy for Hackenbush: choose your move based on which one gives you a bigger advantage.
      That’s great … but we still need a way to <b>quantify</b> that advantage.
    </template>
    <template v-slot:group2="{current}">
      Take a look at this game. Who would you like to be, and who should go first?
    </template>
    <template v-slot:group3>
      You may have noticed that the <Blue/> dog has 7 strings, while the <Red/> cat only has 6. That means that <Blue/>
      can force a win (as long as they’re careful not to let any pieces float away) because <Red/> will run out of pieces. It seems that <Blue/> has a 1-string advantage over
      <Red/>.
    </template>
    <template v-slot:group4>
      But what if <Blue/> and <Red/> have the same number of pieces?
    </template>
    <template v-slot:group5>
      Well, then neither player would have an advantage! The players would take their turns whittling away their pieces (again careful not to let anything float away), and
      <Purple>whoever goes first would lose.</Purple>
    </template>
    <template v-slot:group6>
      This works great when games are neatly separated into <Blue/> and <Red/> components, but what happens when pieces of different colors are connected?
      Things can get a lot more complicated, even for really simple games like this.
    </template>
    <template v-slot:group7>
      This one has the same number of <Blue/>
      and <Red/> strings, so nobody should have an advantage, right? But look closely — if
      <Blue/> plays first, they cut the string and instantly win, while if <Red/> goes first, they cut their string,
      and then <Blue/> cuts theirs and still wins! Does that mean that <Red/> string is “not worth as much,” somehow, since it’s tethered to the ground by a <Blue/>?
    </template>
    <template v-slot:sticky="{current, enterProgress, progress, direction}">
      <GamePlayer :segments="segments"
                  :subgraph="subgraph"
                  :show-turn="current >= 1 && current != 5"
                  :starting-player="startingPlayer"
                  :flush="flushRef"
                  :segments-opacity="enterProgress < 1 ? enterProgress : undefined"
                  :preventClick="preventClick"
                  @segmentClicked="onSegmentClicked"
                  :aiControls="aiControls"
                  :autoplay="autoplay"
      >
      </GamePlayer>
    </template>

  </ScrollytellSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import dogcat from "@/game-files/dogcat.json"
import twocats from "@/game-files/twocats.json"
import onehalf from "@/game-files/onehalf.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import Purple from "@/components/explorable/text-elements/Purple.vue"

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
  currentSlide.value = current;
  console.log("slideChange", current, direction);
  if (current == 1) {
    startingPlayer.value = undefined;
    flush();
  }
  if (current == 4) {
    if (direction < 0) {
      reset();
    } else {
      autoplay.value = true;
      startingPlayer.value = Color.Red;
      aiControls.value = [Color.Red, Color.Blue];
      flush();
    }
  }
  if (current == 5) {
    startingPlayer.value = undefined;
    reset();
  }

  // if (current < 1 && direction < 0) {
  //   reset();
  // }
  // if (current == 0) {
  //   startingPlayer.value = Color.Blue;
  //   reset();
  // }
  // if (current == 1) {
  //   startingPlayer.value = Color.Red;
  //   flush();
  // }
  // if (current == 2) {
  //   startingPlayer.value = Color.Red;
  //   reset();
  // }
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