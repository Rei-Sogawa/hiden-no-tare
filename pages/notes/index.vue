<template>
  <b-container>
    <h1 class="text-center">Hiden no Tare</h1>

    <div class="mb-3">
      <h3>タグ一覧</h3>
      <b-button
        v-for="tag in tags"
        :key="tag.name"
        class="mr-2"
        :variant="tag.name === activeTagName ? 'success' : 'secondary'"
        @click="onClickTag(tag)"
      >
        {{ `${tag.name} (${tag.count})` }}
      </b-button>
    </div>

    <h3>ノート一覧</h3>
    <b-list-group>
      <b-list-group-item
        v-for="note in activeTagName ? notesFilterByTag : notes"
        :key="note.id"
      >
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }"
          ><h5>{{ note.latestHistory.title }}</h5></NuxtLink
        >
        <div class="text-muted">
          <div>更新日: {{ formattedDate(note.updatedAt) }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import firebase from 'firebase'
import { Component, Vue } from 'nuxt-property-decorator'

import { notesStore, usersStore } from '@/store'
import { formattedYearDateTime } from '@/utils/date-utils'

@Component
export default class NotesIndex extends Vue {
  created() {
    usersStore.initialize()
    notesStore.initialize()
  }

  get notes() {
    return notesStore.storedNotes
  }

  get tags() {
    return notesStore.tags
  }

  get activeTagName() {
    return this.$route.query.tagName
  }

  get notesFilterByTag() {
    if (typeof this.activeTagName === 'string') {
      return notesStore.notesFilterByTag(this.activeTagName)
    } else {
      return []
    }
  }

  formattedDate(timestamp: firebase.firestore.Timestamp | null) {
    return formattedYearDateTime(timestamp)
  }

  onClickTag(tag: { name: string; count: number }) {
    if (tag.name === this.activeTagName) {
      this.$router.push({ name: 'notes' })
    } else {
      this.$router.push({ name: 'notes', query: { tagName: tag.name } })
    }
  }
}
</script>
