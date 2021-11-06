<template>
  <div class="flex flex-col items-center">
      <h1 v-if="gameFile?.name" class="text-4xl">{{gameFile.name}}</h1>
      <GamePlayer v-if="gameFile?.segments"
                  :segments="gameFile.segments"
      ></GamePlayer>
  </div>
</template>

<script lang="ts">
import {ref, defineComponent, PropType} from "vue"
  import GamePlayer from "@/components/player/GamePlayer.vue";

  const folderImports = {
    presentation: (file: string) => import(`../game-files/presentation/${file}.json`)
  }

  export default defineComponent({
    components: {GamePlayer},
    props: {
      file: String,
      folder: String as PropType<keyof typeof folderImports>,
    },
    async mounted () {
      if (!this.gameFile && this.file) {
        if (this.folder && this.folder in folderImports) {
          this.gameFile = await folderImports.presentation(this.file);
          return;
        }
        this.gameFile = await import(`../game-files/${this.file}.json`);
      }
    },
    data () {
      return {
        gameFile: null,
      }
    },
  })
</script>