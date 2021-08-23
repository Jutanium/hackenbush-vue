<template>
  <div v-if="width > 1000">
    <TheTitle/>
    <LetsPlayAGame></LetsPlayAGame>
    <GamesAndMath></GamesAndMath>
    <FirstStrategies></FirstStrategies>
    <QuantifyingAdvantage></QuantifyingAdvantage>
  </div>
  <div v-else class="p-4 text-xl">
    A mobile version of this math exploration is coming soon; for now, open this site on a bigger screen!
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