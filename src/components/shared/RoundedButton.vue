<template>
  <button
      @click="$emit('click')"
      class="border-2 rounded-2xl border-gray-400 text-center flex justify-center items-center hover:bg-gray-100">
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