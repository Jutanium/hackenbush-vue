<template>
  <ExplorableSection reverse :topGap="true" :num-groups="9" @slideChange="slideChange" title="The Three Rules">
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
      So let’s decide, right here and now, on three simple rules, to quantify who has the advantage in a game:
    </template>
    <template v-slot:group5>
      <p>
        <b>Rule 0:</b>	Any game where whoever goes first loses has a value of <Purple>zero</Purple>.
      </p>
    </template>
    <template v-slot:group6>
      <p>
        <b>Rule 1:</b> The game with a single <Blue/> string has a value of <Blue>1</Blue>.
      </p>
    </template>
    <template v-slot:group7>
      <p>
        <b>Rule 2:</b> The total value of a game made up of two separate games, attached to the ground but
        disconnected from each other, is the sum of their individual values.
      </p>
    </template>
    <template v-slot:group8>
      (We’re also assuming, as before, that everybody always makes the best possible moves available to them.)
      We’ll refer back to these rules continually so that we can analyze our games more carefully. They’ll get us surprisingly far once we get a feel for them.
    </template>
    <template v-slot:sticky="{current, enterProgress, progress, direction}">
      <Billmoji class="max-h-96 ml-auto mr-auto" v-if="billmojis[current]" :sprite="billmojis[current]"></Billmoji>
      <GamePlayer v-else-if="current < 7"
                  pictureMode
                  :segments="rulesegments(current)"
                  showValue
                  :show-turn="false"
      >
      </GamePlayer>

      <div v-if="current == 7" class="flex text-2xl flex-col items-center">
        <div>
          Combined game value: <Blue>2</Blue>
        </div>
        <div class="flex flex-row">
          <GamePlayer
            pictureMode
            :segments="rulesegments(current)"
            showValue
            :show-turn="false"
          >
          </GamePlayer>
          <GamePlayer
            pictureMode
            :segments="rulesegments(current)"
            showValue
            :show-turn="false"
          >
          </GamePlayer>
        </div>
      </div>
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
import rulezero from "@/game-files/small/1+-1game.json"
import ruleone from "@/game-files/small/1game.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import Purple from "@/components/explorable/text-elements/Purple.vue"
import ExplorableSection from "@/components/explorable/ExplorableSection.vue";
import Billmoji from "@/components/explorable/Billmoji.vue";

const billmojis = ["pointerb", "pointera", "eurekab", "eurekaa", "board",,,, "pointerb"];

const rulesegments = current => {
  return [rulezero.segments, ruleone.segments, ruleone.segments][current - 5];
}

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;

}

</script>

<style scoped>

</style>
