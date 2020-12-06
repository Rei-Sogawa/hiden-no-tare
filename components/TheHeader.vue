<template>
  <b-navbar>
    <b-container>
      <b-navbar-nav>
        <template v-if="isSignedIn">
          <b-nav-item :to="{ name: 'notes' }">ホーム</b-nav-item>
          <b-nav-item :to="{ name: 'notes-new' }">新規ノート</b-nav-item>
          <b-nav-item>マイページ</b-nav-item>
          <b-nav-item @click="onSignOutClick">Sign Out</b-nav-item>
        </template>
        <b-nav-item v-else @click="onSignInClick">Sign In</b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { authStore, usersStore } from '@/store'

@Component
export default class TheHeader extends Vue {
  get isSignedIn() {
    return authStore.isSignedIn
  }

  get currentUser() {
    return usersStore.currentUser
  }

  onSignInClick() {
    authStore.signIn()
  }

  onSignOutClick() {
    authStore.signOut()
  }
}
</script>
