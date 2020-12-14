<template>
  <div class="h-100 d-flex flex-column">
    <TheHeader />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { auth } from '@/plugins/firebaseApp'
import { authStore } from '@/store'

@Component
export default class Default extends Vue {
  created() {
    auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await authStore.doSignIn(firebaseUser)
        this.$router.push({ name: 'notes' })
      } else {
        await authStore.doSignOut()
        this.$router.push({ name: 'index' })
      }
    })
  }
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
