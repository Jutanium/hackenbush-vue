<template>

  <span class="text-red-player" :class="{'font-bold': this.bold}">
    <slot v-if="$slots.default"></slot>
    <template v-else>Red</template>
  </span>
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
