<template>
  <GameCreator></GameCreator>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameCreator from "./components/creator/GameCreator.vue";

export default defineComponent({
  components: {
    GameCreator
  }
})
</script>

<style>
</style>
