<template>
  <img :src="sprites[props.sprite]"/>
</template>

<script setup lang="ts">
import pointera from "@/assets/bill/BillPointera.png"
import pointerb from "@/assets/bill/BillPointerb.png"
import thinkina from "@/assets/bill/BillThinkina.png"
import thinkinb from "@/assets/bill/BillThinkinb.png"
import eureka from "@/assets/bill/BillEureka.png"
import eurekaa from "@/assets/bill/BillEurekaa.png"
import eurekab from "@/assets/bill/BillEurekab.png"
import board from "@/assets/bill/BillBoard.png"

const sprites = { pointera, pointerb, thinkina, thinkinb, eureka, eurekaa, eurekab, board}

const props = withDefaults(defineProps<{
  sprite: keyof typeof sprites
}>(), {sprite: "pointera"});

</script>

<style scoped>

</style>