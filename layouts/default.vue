<template>
  <div>
    <TheHeader />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { auth } from '@/plugins/firebaseApp'
import { authStore, usersStore } from '@/store'

@Component
export default class Default extends Vue {
  created() {
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        authStore.doSignIn(firebaseUser)
        usersStore.update(firebaseUser)
      } else {
        authStore.doSignOut()
      }
    })
  }

  fetch() {
    usersStore.initialize()
  }

  get currentUser() {
    return usersStore.currentUser
  }

  get user() {
    if (authStore.uid !== undefined) {
      return usersStore.findUserById(authStore.uid!)
    }
  }
}
</script>
