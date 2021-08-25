<template>
  <div class="h-screen w-full flex flex-col items-center">
    <div class="ml-6 md:ml-0 text-5xl font-bold mt-44" ref="title">
      The Most Mathematical Game
    </div>
    <div class="text-2xl font-bold mt-8" ref="subtitle">
      An Interactive Exploration
    </div>
    <div class="mt-8" ref="byline">
      Developed by Dan Jutan and taught by Bill Shillito
    </div>
    <div ref="artcredit">
      With art by Steve Johnson
    </div>
    <div ref="scroll" class="text-center mt-16 mb-4">
      Scroll to Continue
    </div>
    <div class="transform -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-1/2 max-w-xl" ref="demo">
      <GameCreator :demoMode="true"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import {Color} from "@/model/segment-color";
import {computed, onMounted, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import GamePlayer from "@/components/player/GamePlayer.vue";
import GameCreator from "@/components/creator/GameCreator.vue";
import {gsap} from "gsap"

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  console.log("slideChange", current, direction);
}

const title = ref();
const subtitle = ref();
const scroll = ref();
const byline = ref();
const artcredit = ref();
const demo = ref();

onMounted(() => {
  const fadeIn = gsap.timeline({delay: 0.5});
  fadeIn.fromTo(title.value, {opacity: 0}, {opacity: 1, duration: 1.5})
  fadeIn.fromTo([demo.value], {opacity: 0}, {opacity: 1, duration: 2}, "-=1.5")
  fadeIn.fromTo([subtitle.value], {opacity: 0}, {opacity: 1, duration: 2}, "-=0.8")
  fadeIn.fromTo(byline.value, {opacity: 0}, {opacity: 1, duration: 1.2}, "-=0.8")
  fadeIn.fromTo(artcredit.value, {opacity: 0}, {opacity: 1, duration: 1.2})
  fadeIn.fromTo(scroll.value, {opacity: 0}, {opacity: 1, duration: 1, repeat: -1, yoyo: true}, "-=0.1")
})
</script>

<style scoped>

</style>