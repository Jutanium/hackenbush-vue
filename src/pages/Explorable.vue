<template>
  <div class="space-y-20">
    <TheTitle/>
    <LetsPlayAGame></LetsPlayAGame>
    <GamesAndMath></GamesAndMath>
    <FirstStrategies></FirstStrategies>
    <QuantifyingAdvantage></QuantifyingAdvantage>
    <div class="w-full h-screen flex flex-col justify-center items-center lg:scroll-snap">
      <p>
        This is our entry for the <a href="https://www.3blue1brown.com/blog/some1" class="text-blue-500 hover:text-blue-600 cursor-pointer"> SOME1 </a>
        competition. Thanks so much for checking it out!<br>
        We're a teacher-student team and this is the start of a longform explorable explanation we've been working on. <br>
        <br>We're adding new sections almost every day, so be sure to check back here to continue the journey&mdash;we're excited to have you along.<br>
      </p>
      <p class="text-center mt-4">
        Dan Jutan and Bill Shillito
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineComponent } from "vue"
  import ScrollytellSection from "@/components/scrollytell/ScrollytellSection.vue";
  import GamePlayer from "@/components/player/GamePlayer.vue";
  import Scissors from "@/components/player/Scissors.vue";
  import {Color} from "@/model/segment-color";
  import LetsPlayAGame from "@/components/explorable/1-LetsPlayAGame.vue";
  import GamesAndMath from "@/components/explorable/2-GamesAndMath.vue"
  import FirstStrategies from "@/components/explorable/3-FirstStrategies.vue"
  import QuantifyingAdvantage from "@/components/explorable/4-QuantifyingAdvantage.vue"
  import TheTitle from "@/components/explorable/0-Title.vue"
  import useBreakpoints from "@/components/shared/useBreakpoints";

  const { width, type } = useBreakpoints();
</script>

<style scoped>

</style>