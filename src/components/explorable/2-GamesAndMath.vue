<template>
  <ScrollytellSection :num-groups="7" @slideChange="slideChange">
    <template v-slot:group1>
      The game you just played is called <b>Hackenbush</b>.
      It’s one of many games explored by the mathematician <b>John Horton Conway</b>.
      For Conway, games and mathematics were deeply intertwined, and he wrote a number of books about the relationship between them.
    </template>
    <template v-slot:group2>
      Wait a minute … what do games have to do with mathematics?
    </template>
    <template v-slot:group3>
      I mean, yes, we can obviously do things like count the number of pieces (like our <Blue/> or <Red/> strings), or look at what kinds of geometric shapes are involved in a game.
    </template>
    <template v-slot:group4>
      But there’s much more to mathematics than that.
    </template>
    <template v-slot:group5>
      When we make up a game, and then analyze that game to try to find out the best way to win, that’s also mathematics. In fact that’s really what mathematics is all about — inventing simple rules, and then discovering where they lead.
    </template>
    <template v-slot:group6>
      Not to mention, games are fun! And mathematics? Well … mathematics can (and should) be fun too.
    </template>
    <template v-slot:group7>
      So let’s see if we can get to the bottom of how to win at Hackenbush.
    </template>
    <template v-slot:sticky="{current, progress, enterProgress, direction}">
      <img :src="golPaper" :style="translateUp(-100 + (current + progress + enterProgress) * 30)" class="absolute z-0 w-full">
      <img :src="sprouts" :style="translateUp( -1900 + (current + progress + enterProgress) * 400)" class="absolute left-1/3 w-2/3">
      <img :src="amazons" :style="translateUp(-2200 + (current + progress + enterProgress) * 500)" class="absolute w-1/3">
      <img :src="hex" :style="translateUp( -1400 + (current + progress + enterProgress) * 600)" class="absolute left-2/12 w-2/3">
      <img :src="domineering" :style="translateUp( -1600 + (current + progress + enterProgress) * 450)" class="absolute left-1/3 ml-16 w-1/2">
      <GamePlayer :segments="racket.segments" :startingPlayer="'blue'" :showTurn="false" :style="translateUp(Math.min((-429 + (current + progress) * 20), -2400 + (current + progress + enterProgress) * 350, 3000))" class="absolute ml-16 w-2/3"/>
    </template>
    <template v-slot:absolute="{current, progress, enterProgress}">
      <img :src="nim" :style="translateUp(-200 + (current + progress + enterProgress) * 400)" class="absolute w-1/3 left-1/2">
    </template>
  </ScrollytellSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import racket from "@/game-files/racket.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import amazons from "@/assets/amazons.png"
import golPaper from "@/assets/golPaper.jpg"
import hex from "@/assets/hex.png"
import nim from "@/assets/nim.png"
import sprouts from "@/assets/sprouts.jpeg"
import domineering from "@/assets/domineering.png"
import GamePlayer from "@/components/player/GamePlayer.vue";

const translateUp = (amount: number) => ({
  transform: `translateY(${-amount}px)`
})
const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  console.log("slideChange", current, direction);
}

</script>

<style scoped>

</style>