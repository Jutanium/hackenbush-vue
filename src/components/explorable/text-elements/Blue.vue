<template>
  <span class="text-blue-player" :class="{'font-bold': this.bold}">Blue</span>
</template>

<script>
export default {
  props: {
    bold: {
      type: Boolean,
      default: true
    }
  }
}
</script>
