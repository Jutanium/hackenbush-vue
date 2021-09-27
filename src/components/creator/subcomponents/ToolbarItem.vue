<template>
  <button :style="computedStyles">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {ref, defineComponent} from "vue"

export default defineComponent({
  name: "ToolbarItem",
  props: {
    color: String,
    selected: Boolean
  },
  computed: {
    computedStyles(): object {
      if (this.color) {
        if (this.selected) {
          return {
            backgroundColor: this.color,
            borderColor: "rgba(0,0,0,0.25)"
          }
        }
        return {
          borderColor: this.color,
        }
      }
      if (this.selected) {
        return {
          backgroundColor: "lightgray"
        }
      }
      return {
        backgroundColor: "white"
      }
    }
  },
  methods: {},
  data() {
    return {}
  }
})
</script>

<style scoped>
button {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border-width: 4px;
  border-style: solid;
  margin: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>