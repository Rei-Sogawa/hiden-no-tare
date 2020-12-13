<template>
  <b-navbar>
    <b-container>
      <b-navbar-nav>
        <template v-if="isSignedIn">
          <b-nav-item @click="onSignOutClick">Sign Out</b-nav-item>
        </template>
        <b-nav-item v-else @click="onSignInClick">Sign In</b-nav-item>
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

  async onSignInClick() {
    try {
      await authStore.signIn()
      this.$router.push({ name: 'notes' })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  async onSignOutClick() {
    await authStore.signOut()
    this.$router.push({ name: 'index' })
  }
}
</script>
