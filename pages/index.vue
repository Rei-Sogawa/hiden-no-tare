<template>
  <b-container class="home">
    <TheHeader class="my-3" />
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group v-if="!loading">
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          {{ noteHistoryById(note.id).title }}
        </NuxtLink>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  components: { TheHeader },
  computed: {
    ...mapGetters('home', ['notes', 'noteHistories', 'noteHistoryById']),
    loading() {
      return !this.notes || !this.noteHistories
    },
  },
  created() {
    this.fetchNotes()
    this.fetchNoteHistories()
  },
  destroyed() {
    this.resetState()
  },
  methods: {
    ...mapActions('home', ['fetchNotes', 'fetchNoteHistories', 'resetState']),
  },
})
</script>

<style scoped>
.home {
  max-width: 720px;
}
</style>
