<template>
  <b-container>
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group v-if="!loading">
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          {{ latestNoteHistory(note.id).title }}
        </NuxtLink>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('notes', [
      'notesListener',
      'noteHistoriesListener',
      'notes',
      'noteHistories',
      'latestNoteHistory',
    ]),
    loading() {
      return !this.notes || !this.noteHistories
    },
  },
  created() {
    if (!this.notesListener) {
      this.subscribeNotes()
    }
    if (!this.noteHistoriesListener) {
      this.subscribeNoteHistories()
    }
  },
  methods: {
    ...mapActions('notes', ['subscribeNotes', 'subscribeNoteHistories']),
  },
})
</script>
