<template>
  <span class="text-blue-player" :class="{'font-bold': this.bold}">{{$slots.default || 'bLue'}}</span>
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
