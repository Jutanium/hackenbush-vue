<template>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  export default defineComponent({
    props: {
      file: String
    },
     setup: async (props) => {
      const gameFile = await import("./game-files/" + props.file + ".json");
      return {
        gameFile
      }
    },
    data () {
      return {

      }
    },
  })
</script>

<style scoped>

</style>