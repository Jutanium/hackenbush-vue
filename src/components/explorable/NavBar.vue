<template>
  <div class="fixed m-8">

    {{currentSection}}
    {{sections.length}}

  </div>
</template>

<script setup lang="ts">

import useSections from "./useSections";

const { currentSection, sections } = useSections();

</script>

<style scoped>

</style>