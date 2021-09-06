<template>
  <ExplorableSection :topGap="true" :num-groups="14" :divisions=[3,5] @slideChange="slideChange" title="The Three Rules">
    <template v-slot:group0>
      To start off with, let’s look at the simplest possible game of Hackenbush.
    </template>
    <template v-slot:group1="">
      <p>
        No, really, this is it. The simplest game of Hackenbush has no strings of either color.
      </p>
      <p>
        What’s the  value of this game?
      </p>
    </template>
    <template v-slot:group2>
      If <Blue/> goes first, they automatically lose because they can’t make a move, and <Red/> wins. Likewise, if <Red/> goes first, they can’t do anything, so <Blue/> wins.
      No matter what, <Purple>whoever goes first loses.</Purple>
    </template>
    <template v-slot:group3>
      So, by <b>Rule 0</b>, this game must have a value of <Purple>0</Purple>. (We’ll sometimes call such a game a “<Purple>zero game.</Purple>”)
    </template>
    <template v-slot:group4>
      What’s the overall value of this game? See if you can figure it out before moving on.
    </template>
    <template v-slot:group5>
      You probably already have an idea of what the value is, but let’s use our rules to prove it.
      We can imagine this game as two separate games, each with one <Blue/> string. <b>Rule 1</b> says that each of those is worth <Blue>1</Blue>.
      Then, <b>Rule 2</b> says that when we put these games together, we add their values, so the total value of this game is <Blue>1</Blue> + <Blue>1</Blue> = <Blue>2</Blue>.
      We can apply <b>Rule 2</b> repeatedly to easily get a game worth <Blue>3</Blue>, or <Blue>10</Blue>, or <Blue>573</Blue>, and so on by adding <Blue/> segments.
      All of these games are clear wins for <Blue/>.
    </template>
    <template v-slot:group6>
      <p>
        What about this game?
      </p>
      <p>
        Our three Rules never said anything about <Red/> strings! But we can still tease out the value of this game by getting creative.
      </p>
    </template>
    <template v-slot:group7>
      Suppose we add a single bLue string next to this game. Now what’s the value?
    </template>
    <template v-slot:group8>
      <p class="ml-12">
        If <Blue/> goes first, they cut their string, then <Red/> cuts theirs, and <Red/> wins.<br>
      </p>
    </template>
    <template v-slot:group9>
      <p class="ml-12">
        If <Red/> goes first, they cut their string, then <Blue/> cuts theirs, and <Blue/> wins.
      </p>
    </template>
    <template v-slot:group10>
      Since <Purple>whoever goes first loses</Purple>, by <b>Rule 0</b>, this game must have a value of <Purple>0</Purple>.
      But <b>Rule 1</b> tells us that the single <Blue/> string has a value of <Blue>1</Blue>.
      And <b>Rule 2</b> tells us that the two individual parts get added together. So, working backwards,
    </template>
    <template v-slot:group11>
      the value of that single <Red/> string must be <Red>-1</Red>.
    </template>
    <template v-slot:group12>
      Wait what? Where did negative numbers come from, you might ask? We might not have expected them, but our three Rules told us they had to be there.
    </template>
    <template v-slot:group13>
      They also help us make a stunning observation: <Blue>positive</Blue> numbers represent an advantage for <Blue/>, and <Red>negative</Red> numbers
      give an advantage for <Red/>!
    </template>
    <template v-slot:sticky="{current, enterProgress, progress, direction}">
<!--      <Billmoji class="max-h-96 ml-auto mr-auto" v-if="billmojis[current]" :sprite="billmojis[current]"></Billmoji>-->
      <div>
        <GamePlayer
          :pictureMode="![6, 8,9].includes(current)"
          :starting-player="startingPlayer(current)"
          :segments="segments(current)"
          :showValue="[3, 5, 10, 11, 12, 13].includes(current)"
          :show-turn="[6,8,9].includes(current)"
          :flush="current"
        >
        </GamePlayer>
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
import GamePlayer from "../player/GamePlayer.vue";
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import oneplusone from "@/game-files/small/1+1game.json";
import negativeone from "@/game-files/small/-1game.json"
import oneplusnegativeone from "@/game-files/small/1+-1game.json"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import Purple from "@/components/explorable/text-elements/Purple.vue"
import ExplorableSection from "@/components/explorable/ExplorableSection.vue";
import Billmoji from "@/components/explorable/Billmoji.vue";

const billmojis = ["pointerb", "pointera", "eurekab", "eurekaa", "board",,,, "pointerb"];

const segments = (current: number) => {
  if (current < 4) {
    return {};
  }
  if (current < 6) {
    return oneplusone.segments;
  }
  if (current < 7) {
    return negativeone.segments;
  }
  if (current < 10) {
    return oneplusnegativeone.segments;
  }
  return negativeone.segments;
}

const startingPlayer = (current: number) => {
  console.log(current);
  if (current == 8) return Color.Blue;
  if (current == 9) return Color.Red;
  return undefined;
}

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;

}

</script>

<style scoped>

</style>
