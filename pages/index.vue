<template>
  <b-container>
    <TheHeader class="my-3" />
    <h1 class="text-center">Hiden no Tare</h1>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TheHeader from '@/components/TheHeader.vue'

export default Vue.extend({
  components: { TheHeader },
})
</script>
