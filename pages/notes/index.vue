<template>
  <b-container>
    <div class="mb-3">
      <h1 class="text-center">Hiden no Tare</h1>

      <h3>タグ一覧</h3>
      <b-button
        v-for="tagCountPair in tagCountPairs"
        :key="tagCountPair.tag"
        :variant="tagCountPair.tag === activeTag ? 'success' : 'secondary'"
        class="mr-2"
        @click="onClickTag(tagCountPair.tag)"
      >
        {{ tagCountPair.tag }} ({{ tagCountPair.count }})
      </b-button>
      <hr />

      <h3>ノート一覧</h3>
      <b-list-group>
        <b-list-group-item
          v-for="note in activeTag ? notesFilteredByTag : notes"
          :key="note.id"
        >
          <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
            <h5>{{ note.latestNoteHistory.title }}</h5>
          </NuxtLink>
          <p class="note-content">{{ note.latestNoteHistory.content }}</p>
          <div class="text-muted">
            更新日: {{ formattedDate(note.latestNoteHistory.createdAt) }}
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import firebase from 'firebase'
import { db } from '@/plugins/firebaseApp'
import { INote } from '@/types/note'
import { formattedDate } from '@/utils/date-utils'

@Component
export default class NotesIndex extends Vue {
  notes: INote[] | null = null
  notesFilteredByTag: INote[] | null = null

  get activeTag(): string | undefined {
    return this.$route.query.activeTag as string | undefined
  }

  get tagCountPairs(): { tag: string; count: number }[] {
    if (this.notes) {
      const tagsContainigDuplicates = this.notes.reduce(
        (pre, curr) => pre.concat(curr.tags),
        [] as string[]
      )
      const uniqueTags = tagsContainigDuplicates.filter(
        (x, i, self) => self.indexOf(x) === i
      )
      const tagCountPairs = uniqueTags
        .map((tag) => ({
          tag,
          count: tagsContainigDuplicates.filter((_tag) => _tag === tag).length,
        }))
        .sort((tag1, tag2) => tag2.count - tag1.count)
      return tagCountPairs
    } else {
      return []
    }
  }

  @Watch('activeTag', { immediate: true })
  function(newVal: string | undefined) {
    if (newVal) {
      this.$bind(
        'notesFilteredByTag',
        db
          .collection('notes')
          .where('tags', 'array-contains', newVal)
          .orderBy('latestNoteHistory.createdAt', 'desc')
      )
    }
  }

  created() {
    this.$bind(
      'notes',
      db.collection('notes').orderBy('latestNoteHistory.createdAt', 'desc')
    )
  }

  formattedDate(timestamp: firebase.firestore.Timestamp) {
    return formattedDate(timestamp)
  }

  onClickTag(tag: string) {
    if (tag === this.activeTag) {
      this.$router.push({ name: 'notes' })
    } else {
      this.$router.push({ name: 'notes', query: { activeTag: tag } })
    }
  }
}
</script>

<style scoped>
.note-content {
  height: 50px;
  overflow: hidden;
}
</style>
