<template>
  <div class="d-flex justify-content-end">
    <b-button variant="primary" @click="onClickNewPostButton"
      >新規投稿</b-button
    >
  </div>
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
