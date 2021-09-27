<template>
  <div class="my-12">
    <h1 class="text-4xl text-center">Hackenbush: The Most Mathematical Game</h1>
  </div>
  <div class="flex flex-col-reverse md:flex-row justify-center items-center gap-6 h-full">
    <div class="flex md:flex-col gap-2 overflow-auto max-h-xl w-full md:w-auto">
      <div class="absolute -mt-6 md:static md:mt-0 font-bold text-center md:border-b border-gray-500 min-w-max">Select a Game</div>
      <RoundedButton class="min-w-24" @click="chosenIndex = 0" :class="{'bg-gray-100': chosenIndex == 0}">
        Create Your Own
      </RoundedButton>
      <RoundedButton class="min-w-24" @click="importClicked">
        Import Game
      </RoundedButton>
      <div v-if="importError" class="w-32 md:ml-2 text-red-500">
        {{importError}}
      </div>

      <button v-for="(game, i) in games" class="game-button"
           :class="{'bg-gray-100': chosenIndex == i + 1}"
        @click="chosenIndex = i + 1">
        <GamePlayer :segments="game" picture-mode>
        </GamePlayer>
      </button>
    </div>

    <div class="w-full max-w-lg md:max-w-xl border-b-0 border-gray-300 rounded-b-none rounded-2xl" :class="{'border-2': chosenIndex > 0}">
      <div v-show="chosenIndex == 0">
        <GameCreator class="max-w-creator"></GameCreator>
      </div>
        <GamePlayer v-for="(game, i) in games" :segments="game" v-show="chosenIndex == i + 1"></GamePlayer>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, ComputedRef, onMounted, Ref, ref} from "vue"
import GamePlayer from "@/components/player/GamePlayer.vue";
import GameCreator from "@/components/creator/GameCreator.vue";
import RoundedButton from "@/components/shared/RoundedButton.vue";

import square from "@/game-files/square.json"
import person from "@/game-files/person.json"
import dogcat from "@/game-files/dogcat.json"
import racket from "@/game-files/racket.json"
import twins from "@/game-files/twins.json"

import { SegmentsMap } from "@/model/graph";

const games = ref([square, person, dogcat, racket, twins].map(g => g.segments as SegmentsMap));
const choices: ComputedRef<Array<"create" | SegmentsMap>> = computed(() => ["create", ...games.value]);

const chosenIndex = ref(1);
const chosenGame = computed(() => games.value[chosenIndex.value]);

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
})

const importError: Ref<string | false> = ref(false);

function importClicked () {
  navigator.clipboard.readText().then(
    clipText => {
      let obj;
      try {
        obj = JSON.parse(clipText);
      } catch (e) {
        importError.value = "Clipboard data isn't a valid game"
        return;
      }
      games.value.unshift(obj);
      importError.value = false;
    })
}

</script>

<style scoped>
  .max-h-xl {
    max-height: 36rem;
  }

  .max-w-creator {
    max-width: 33rem;
  }

  .min-w-24 {
    min-width: 6rem;
  }

  .game-button {
    min-width: 6rem;
    max-width: 12rem;
    @apply float-left md:w-36 md:float-none border-2 border-gray-300 rounded-b-none rounded-2xl hover:bg-gray-100
  }
</style>