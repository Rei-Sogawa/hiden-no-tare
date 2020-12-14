<template>
  <b-container
    v-if="users && afterNoteHistory && beforeNoteHistory"
    class="mb-3"
  >
    <h1 class="text-center">ノート更新履歴</h1>
    <b-card>
      <div class="text-muted mb-3">
        <div>
          更新者:
          <NuxtLink
            :to="{ name: 'users-id', params: { id: afterNoteHistory.userId } }"
          >
            {{ userName(afterNoteHistory.authorId) }}
          </NuxtLink>
        </div>
        <div>更新日: {{ formattedDate(afterNoteHistory.createdAt) }}</div>
      </div>

      <h5 class="text-muted">Title</h5>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="part in diffTitle">
        <div :class="{ added: part.added, removed: part.removed }">
          <h1 style="white-space: pre-line">{{ part.value }}</h1>
        </div>
      </div>
      <!-- eslint-enable -->
      <hr />

      <h5 class="text-muted">Content</h5>
      <!-- eslint-disable-next-line vue/require-v-for-key -->
      <div v-for="part in diffContent">
        <div :class="{ added: part.added, removed: part.removed }">
          <div style="white-space: pre-line">{{ part.value }}</div>
        </div>
      </div>
      <!-- eslint-enable -->
    </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from 'firebase'
import { db } from '@/plugins/firebaseApp'
import { INoteHistory } from '@/types/noteHistory'
import { IUser } from '@/types/user'
import { formattedDate } from '@/utils/date-utils'

const Diff = require('diff')

@Component
export default class NotesDiff extends Vue {
  beforeNoteHistory: INoteHistory | null = null
  afterNoteHistory: INoteHistory | null = null
  users: IUser[] | null = null

  created() {
    this.$bind(
      'beforeNoteHistory',
      db
        .collection('notes')
        .doc(this.$route.params.id)
        .collection('noteHistories')
        .doc(this.$route.query.before as string)
    )
    this.$bind(
      'afterNoteHistory',
      db
        .collection('notes')
        .doc(this.$route.params.id)
        .collection('noteHistories')
        .doc(this.$route.query.after as string)
    )
    this.$bind('users', db.collection('users'))
  }

  get diffTitle() {
    return Diff.diffLines(
      this.beforeNoteHistory!.title,
      this.afterNoteHistory!.title
    )
  }

  get diffContent() {
    return Diff.diffLines(
      this.beforeNoteHistory!.content,
      this.afterNoteHistory!.content
    )
  }

  formattedDate(timestamp: firebase.firestore.Timestamp) {
    return formattedDate(timestamp)
  }

  userName(userId: string): string {
    const user = this.users?.find((user: IUser) => user.id === userId)
    return user ? user.name : ''
  }
}
</script>

<style scoped>
.added {
  /* background-color: #acf2bd; */
  background-color: #e6ffed;
}
.removed {
  /* background-color: #fdb8c0; */
  background-color: #ffdce0;
}
</style>
