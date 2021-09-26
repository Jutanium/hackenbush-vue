<template>
  <div class="flex flex-row justify-center items-center w-full h-1/2">

    <div class="flex flex-col h-full w-96 border border-red">
<!--      <div v-for="game in games">-->
<!--        <GamePlayer :segments="game" picture-mode>-->
<!--        </GamePlayer>-->
<!--      </div>-->
    </div>

    <div class="w-1/2 max-w-2xl border">
      <GamePlayer :segments="chosenGame"></GamePlayer>
    </div>

  </div>
</template>


<script setup lang="ts">
import {computed, ref} from "vue"
  import GamePlayer from "@/components/player/GamePlayer.vue";
  import square from "@/game-files/square.json"
  import person from "@/game-files/person.json"
  import dogcat from "@/game-files/dogcat.json"
  import racket from "@/game-files/racket.json"
  import twins from "@/game-files/twins.json"

  const games = [square, person, dogcat, racket, twins].map(g => g.segments);
  const chosenIndex = ref(0);
  const chosenGame = computed(() => games[chosenIndex.value]);

</script>

<style scoped>
</style>