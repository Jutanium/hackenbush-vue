<template>
  <button :class="[textColorClass, {'bg-current': selected}]" class="border-current border-4 rounded-md w-11 h-11 flex justify-center items-center m-1">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {ref, defineComponent} from "vue"

export default defineComponent({
  name: "ToolbarItem",
  props: {
    textColorClass: {
      type: String,
      default: "text-gray-300"
    },
    selected: Boolean
  },
})
</script>

