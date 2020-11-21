<template>
  <b-container class="my-3">
    <div v-if="!loading">
      <b-card :title="latestNoteHistory.title">
        <b-card-text>
          <div v-html="$md.render(latestNoteHistory.content)"></div>
        </b-card-text>
      </b-card>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('notes/show', ['note', 'noteHistories', 'latestNoteHistory']),
    loading() {
      return !this.note || !this.noteHistories
    },
  },
  created() {
    const id = this.$route.params.id
    this.fetchNote(id)
    this.fetchNoteHistories(id)
  },
  destroyed() {
    this.resetState()
  },
  methods: {
    ...mapActions('notes/show', [
      'fetchNote',
      'fetchNoteHistories',
      'resetState',
    ]),
  },
})
</script>

<style scoped>
.notes-show {
  max-width: 720px;
}
</style>
