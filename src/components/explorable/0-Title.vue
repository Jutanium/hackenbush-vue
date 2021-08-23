<template>
  <ScrollytellSection :num-groups="1" @slideChange="slideChange">
    <template v-slot:group1>
      <div class="text-5xl mt-20" ref="title">
        The Most Mathematical Game
      </div>
      <div ref="scroll" class="text-center mt-20">
        Scroll to Continue
      </div>
    </template>
    <template v-slot:absolute="{current, progress, enterProgress}">
    </template>
  </ScrollytellSection>
</template>

<script setup lang="ts">
import ScrollytellSection from "../scrollytell/ScrollytellSection.vue";
import {Color} from "@/model/segment-color";
import {computed, onMounted, ref} from "vue"
import Blue from "@/components/explorable/text-elements/Blue.vue";
import Red from "@/components/explorable/text-elements/Red.vue"
import GamePlayer from "@/components/player/GamePlayer.vue";
import { gsap } from "gsap"

const translateUp = (amount: number) => ({
  transform: `translateY(${-amount}px)`
})
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