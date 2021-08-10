<template>
  <div>
    <ScrollytellSection :num-groups="3">
      <template v-slot:group1>
        Test group 1
      </template>
      <template v-slot:group2>
        Test group 2
      </template>
      <template v-slot:group3>
        Test group 3
      </template>
      <template v-slot:sticky="{current, progress}">
        {{current}} {{progress}}
        <div class="w-3/4">
          <GamePlayer :segments="dog.segments"></GamePlayer>
        </div>
      </template>
    </ScrollytellSection>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import ScrollytellSection from "@/components/scrollytell/ScrollytellSection.vue";
  import GamePlayer from "@/components/player/GamePlayer.vue";
  import square from "@/game-files/square.json"
  import dog from "@/game-files/dog.json"

  export default defineComponent({
    components: {ScrollytellSection, GamePlayer},
    props: {
    },
    setup: () => {
    },
    data () {
      return {
        square,
        dog
      }
    },
  })
</script>

<style scoped>

</style>