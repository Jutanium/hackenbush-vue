<template>
  <div class="h-screen w-full flex flex-col items-center">
    <div class="h-1/3"></div>
    <div class="text-5xl font-bold mt-20" ref="title">
      The Most Mathematical Game
    </div>
    <div ref="scroll" class="text-center mt-20">
      Scroll to Continue
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
import {gsap} from "gsap"

const slideChange = (scrollData: { current: number, direction: number }) => {
  const {current, direction} = scrollData;
  console.log("slideChange", current, direction);
}

const title = ref();
const scroll = ref();

onMounted(() => {
  gsap.fromTo(title.value, {opacity: 0}, {opacity: 1, duration: 2})

  const blink = gsap.timeline({delay: 1, repeat: -1, yoyo: true});
  blink.fromTo(scroll.value, {opacity: 0}, {opacity: 1, duration: 1})
})
</script>

<style scoped>

</style>