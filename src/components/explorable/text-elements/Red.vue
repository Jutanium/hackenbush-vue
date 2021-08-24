<template>
  <span class="text-red-player" :class="{'font-bold': this.bold}">Red</span>
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
