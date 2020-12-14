<template>
  <div>
    <TheHeader />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { auth } from '@/plugins/firebaseApp'
import { authStore } from '@/store'

@Component
export default class Default extends Vue {
  created() {
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        authStore.doSignIn(firebaseUser)
      } else {
        authStore.doSignOut()
      }
    })
  }
}
</script>
