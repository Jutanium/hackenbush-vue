<template>
  <rect class="fill-current text-green-ground"
        :width="width" :height="height" :y="y">
  </rect>
</template>

<script>
export default {
  props: {
    y: {
      type: Number,
      default: 95,
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 95
    }
  }
}
</script>

<style scoped>

</style>