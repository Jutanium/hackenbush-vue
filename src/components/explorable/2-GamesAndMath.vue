<template>
  <ScrollytellSection :num-groups="7" @slideChange="slideChange">
    <template v-slot:group1>
      The game you just played is called <b>Hackenbush</b>.
      It’s one of many games invented by the mathematician <b>John Horton Conway</b>.
      For Conway, games and mathematics were deeply intertwined, and he wrote a number of books about the relationship between them.
    </template>
    <template v-slot:group2>
      asdf
    </template>
    <template v-slot:group3>
    </template>
    <template v-slot:group4>
    </template>
    <template v-slot:group5>
    </template>
    <template v-slot:group6>
    </template>
    <template v-slot:group7>
    </template>
    <template v-slot:sticky="{current, progress, enterProgress, direction}">

      <img :src="golPaper" :style="translateUp( -200 + (current + progress + enterProgress) * 300)" class="w-2/3">
      <img :src="phutball" :style="translateUp( -100 + (current + progress + enterProgress) * 200)" class="absolute top-0 left-1/2 w-1/3">

    </template>
  </ScrollytellSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import GamePlayer from "../player/GamePlayer.vue";
import person from "@/game-files/person.json"
import {Color} from "@/model/segment-color";
import {computed, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import phutball from "@/assets/phutball.png"
import golPaper from "@/assets/golPaper.jpg"

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