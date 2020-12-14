<template>
  <b-navbar>
    <b-container>
      <b-navbar-nav>
        <template v-if="isSignedIn">
          <b-nav-item :to="{ name: 'notes' }">ホーム</b-nav-item>
          <b-nav-item :to="{ name: 'notes-new' }">新規ノート</b-nav-item>
          <b-nav-item @click="onClickSignOut">Sign Out</b-nav-item>
        </template>
        <b-nav-item v-else @click="onClickSignIn">Sign In</b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore } from '@/store'

@Component
export default class TheHeader extends Vue {
  get isSignedIn() {
    return authStore.isSignedIn
  }

  onClickSignIn() {
    authStore.signIn()
  }

  onClickSignOut() {
    authStore.signOut()
  }
}
</script>
