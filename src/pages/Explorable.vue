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
    </ScrollytellSection>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import ScrollytellSection from "@/components/scrollytell/ScrollytellSection.vue";
  export default defineComponent({
    components: {ScrollytellSection},
    props: {
    },
    setup: () => {
    },
    data () {
      return {

      }
    },
  })
</script>

<style scoped>

</style>