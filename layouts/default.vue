<template>
  <div class="h-100 d-flex flex-column">
    <TheHeader />
    <Nuxt class="flex-fill" />
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'

export default {
  components: {
    TheHeader,
  },
}
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}
</style>
