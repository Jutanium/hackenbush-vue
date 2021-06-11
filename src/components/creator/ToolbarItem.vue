<template>
  <div :style="computedStyles">

  </div>
</template>

<script lang="ts">
  import { ref, defineComponent } from "vue"

  export default defineComponent({
    name: "ToolbarItem",
    props: {
      color: String
    },
    computed: {
      computedStyles () {
        return {
          backgroundColor: this.color
        }
      }
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
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.25);
    margin: 5px;
  }
</style>