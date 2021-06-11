<template>
  <div>
    <ToolbarItem color="green"></ToolbarItem>
    <ToolbarItem color="lightgray"></ToolbarItem>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"
  import ToolbarItem from "./ToolbarItem.vue";

  export default defineComponent({
    name: "Toolbar",
    components: {ToolbarItem},
    props: {
    },
    setup: () => {
    },
    methods: {
    },
    data () {
      return {

      }
    }
  })
</script>

<style scoped>
  div {
    display: flex;
  }
</style>