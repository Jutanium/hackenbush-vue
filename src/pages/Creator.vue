<template>
  <div class="root">
    <button @click="this.create = !this.create">{{ this.create ? "Play" : "Create" }}</button>
    <component :is="currentComponent" v-bind="currentComponentProps"></component>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import GameCreator from "../components/creator/GameCreator.vue";
import GamePlayer from "@/components/player/GamePlayer.vue";
import {state} from "@/components/creator/state/game-file";
export default defineComponent({
  components: {
    GameCreator
  },
  data() {
    return {
      create: true
    }
  },
  computed: {
    currentComponent() {
      if (this.create) {
        return GameCreator;
      }
      return GamePlayer;
    },
    currentComponentProps() {
      if (!this.create) {
        return {
          segments: state.segments,
          groundY: state.groundY
        }
      }
    }
  }
})
</script>

<style>
div.root {
  width: 600px;
}
</style>
