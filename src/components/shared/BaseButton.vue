<template>
  <button
      @click="$emit('click')"
      class="px-6 text-lg text-center text-white transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-600">
    <slot/>
  </button>
</template>
<script lang="ts">
export default {
  emits: ["click"],
  props: {
  }
}
</script>