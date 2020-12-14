<template>
  <b-container>
    <div class="mb-3">
      <h1 class="text-center">Hiden no Tare</h1>

      <b-form @submit.prevent="onSubmitSearchText">
        <b-form-input
          v-model="searchText"
          type="text"
          placeholder="検索キーワード"
        ></b-form-input>
      </b-form>
      <hr />

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
      <br />

      <h3>
        ノート一覧
        <span v-if="activeTag">（タグで検索: "{{ activeTag }}"）</span>
        <span v-if="activeSearchText"
          >（キーワードで検索: "{{ activeSearchText }}"）</span
        >
      </h3>

      <b-list-group>
        <b-list-group-item v-for="note in activeNotes" :key="note.id">
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
import { db } from '@/plugins/firebaseApp'
import { INote } from '@/types/note'
import { format, fromUnixTime } from 'date-fns'
import algoliaConfig from '@/plugins/algoliaConfig'
const algoliasearch = require('algoliasearch')

const client = algoliasearch(algoliaConfig.appId, algoliaConfig.searchApiKey)
const index = client.initIndex('note_index')

@Component
export default class NotesIndex extends Vue {
  searchText: string = ''
  notes: INote[] | null = null
  notesFilteredByTag: INote[] | null = null
  notesFilteredBySerachText: INote[] | null = null

  get activeSearchText(): string | undefined {
    return this.$route.query.activeSearchText as string | undefined
  }

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

  get activeNotes(): INote[] {
    if (this.activeSearchText) {
      return this.notesFilteredBySerachText!
    }
    if (this.activeTag) {
      return this.notesFilteredByTag!
    }
    return this.notes!
  }

  @Watch('activeTag', { immediate: true })
  onChangeActiveTag(newVal: string | undefined) {
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

  @Watch('activeSearchText', { immediate: true })
  async onChangeActiveSearchText(newVal: string | undefined) {
    if (newVal) {
      const searchResult = await index.search(this.activeSearchText)
      this.notesFilteredBySerachText = searchResult.hits
    }
  }

  created() {
    this.$bind(
      'notes',
      db.collection('notes').orderBy('latestNoteHistory.createdAt', 'desc')
    )
  }

  formattedDate(timestamp: any) {
    const seconds = timestamp.seconds || timestamp._seconds
    return seconds ? format(fromUnixTime(seconds), 'yyyy/MM/dd HH:mm') : ''
  }

  onClickTag(tag: string) {
    if (tag === this.activeTag) {
      this.$router.push({ name: 'notes' })
    } else {
      this.$router.push({ name: 'notes', query: { activeTag: tag } })
    }
  }

  onSubmitSearchText() {
    if (this.searchText!.trim()) {
      this.$router.push({
        name: 'notes',
        query: { activeSearchText: this.searchText },
      })
    } else {
      this.$router.push({ name: 'notes' })
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
