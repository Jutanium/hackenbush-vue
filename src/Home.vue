<template>
  <div>
    <router-link class="link" to="/creator">Creator</router-link>
    <ol>
      <li v-for="(game, i) in games">
        <router-link class="link" :to="'/play/' + game">
          <div class="game-picture" v-if="gameFiles[i]">
            <GamePlayer :picture-mode="true" :segments="gameFiles[i].segments" :ground-connections="gameFiles[i].groundConnections"></GamePlayer>
          </div>
        </router-link>
      </li>
    </ol>
  </div>
</template>


<script lang="ts">
  import { ref, defineComponent } from "vue"
  import GamePlayer from "@/components/player/GamePlayer.vue";
  export default defineComponent({
  components: {GamePlayer},
  data () {
    return {
      games: ["person", "dog", "racket", "twins"],
      gameFiles: []
    }
  },
  async mounted () {
    for (const file of this.games) {
      const gameFile = await import("./game-files/" + file + ".json");
      this.gameFiles.push(gameFile)
    }
  }
})
</script>

<style scoped>
  div {
    padding: 12px;
  }
  .link {
    text-decoration: none;
  }
  .game-picture {
    width: 300px;
  }
</style>