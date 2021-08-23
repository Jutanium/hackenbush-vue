<template>
  <div>
    <LetsPlayAGame></LetsPlayAGame>
<!--    <GamesAndMath></GamesAndMath>-->
<!--    <FirstStrategies></FirstStrategies>-->
    <QuantifyingAdvantage></QuantifyingAdvantage>
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


</script>

<style scoped>

</style>