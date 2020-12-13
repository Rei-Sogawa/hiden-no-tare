<template>
  <b-container>
    <h1 class="text-center">Hiden no Tare</h1>
    <h3>ノート一覧</h3>
    <b-list-group>
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          <h5>{{ note.latestNoteHistory.title }}</h5>
        </NuxtLink>
        <p class="note-content">{{ note.latestNoteHistory.content }}</p>
        <div class="text-muted">
          更新日: {{ formattedDate(note.latestNoteHistory.createdAt) }}
        </div>
      </b-list-group-item>
    </b-list-group>
    <br />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from 'firebase'
import { db } from '@/plugins/firebaseApp'
import { INote } from '@/types/note'
import { formattedDate } from '@/utils/date-utils'

@Component
export default class NotesIndex extends Vue {
  notes: INote[] = []

  created() {
    this.$bind('notes', db.collection('notes'))
  }

  formattedDate(timestamp: firebase.firestore.Timestamp) {
    return formattedDate(timestamp)
  }
}
</script>

<style scoped>
.note-content {
  height: 50px;
  overflow: hidden;
}
</style>
