<template>
  <img :src="sprites[props.sprite]"/>
</template>

<script setup lang="ts">
import pointera from "@/assets/bill/BillPointera.png"
import pointerb from "@/assets/bill/BillPointerb.png"
import thinkina from "@/assets/bill/BillThinkina.png"
import thinkinb from "@/assets/bill/BillThinkinb.png"

const sprites = { pointera, pointerb, thinkina, thinkinb }

const props = withDefaults(defineProps<{
  sprite: keyof typeof sprites
}>(), {sprite: "pointera"});

</script>

<style scoped>

</style>