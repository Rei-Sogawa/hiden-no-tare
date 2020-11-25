<template>
  <b-container>
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group>
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          {{ note.latestHistory.title }}
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
    ...mapGetters('notes', ['notes', 'notesListener']),
  },
  created() {
    if (!this.notesListener) {
      this.subscribeNotes()
    }
  },
  methods: {
    ...mapActions('notes', ['subscribeNotes']),
  },
})
</script>
