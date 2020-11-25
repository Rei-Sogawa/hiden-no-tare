<template>
  <b-navbar>
    <b-container>
      <b-navbar-nav>
        <template v-if="isLoggedIn">
          <b-nav-item :to="{ name: 'index' }">ホーム</b-nav-item>
          <b-nav-item :to="{ name: 'notes-new' }">新規作成</b-nav-item>
          <b-nav-item @click="signOut">Sign Out</b-nav-item>
        </template>
        <b-nav-item v-else @click="signIn">Sign In</b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheHeader',
  computed: {
    ...mapGetters('users', ['isLoggedIn']),
  },
  methods: {
    ...mapActions('users', ['signIn', 'signOut']),
  },
}
</script>
