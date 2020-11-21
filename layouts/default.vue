<template>
  <div class="h-100 d-flex flex-column">
    <Nuxt class="flex-fill" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TheHeader from '@/components/TheHeader.vue'

export default Vue.extend({
  components: { TheHeader },
})
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}
</style>
