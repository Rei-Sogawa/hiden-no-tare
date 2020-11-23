<template>
  <b-navbar>
    <b-container>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'index' }">ホーム</b-nav-item>
        <b-nav-item :to="{ name: 'notes-new' }">新規作成</b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onClickNewPostButton() {
      this.$router.push('/notes/new')
    },
  },
})
</script>
