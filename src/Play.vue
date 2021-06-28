<template>
  <div>
      <GamePlayer v-if="gameFile?.segments"
                  :segments="gameFile.segments"
                  :ground-connections="gameFile.groundConnections"
      ></GamePlayer>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import GamePlayer from "@/components/player/GamePlayer.vue";
  export default defineComponent({
    components: {GamePlayer},
    props: {
      file: String
    },
    async mounted () {
      if (!this.gameFile) {
        const gameFile = await import("./game-files/" + this.file + ".json");
        this.gameFile = gameFile;
      }
    },
    data () {
      return {
        gameFile: null,
      }
    },
  })
</script>

<style scoped>

</style>