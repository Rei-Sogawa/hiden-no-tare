<template>
  <div class="h-100 d-flex flex-column">
    <b-container v-if="isShowPage">
      <b-row class="mb-3">
        <b-col cols="9">
          <h5>ノート</h5>
          <b-card v-if="note" no-body class="mb-3">
            <template #header>
              <b-icon
                icon="pencil"
                class="float-right pencil-icon"
                @click="onClickEdit"
              ></b-icon>
            </template>
            <b-card-body>
              <b-card-title>
                <h1>
                  {{ note.latestNoteHistory.title }}
                </h1>
              </b-card-title>

              <div class="mb-3">
                <b-badge
                  v-for="tag in note.tags"
                  :key="tag"
                  class="mr-1"
                  variant="success"
                  >{{ tag }}</b-badge
                >
              </div>
              <hr />

              <div class="text-muted mb-1 clearfix">
                <div>
                  作成者:
                  <NuxtLink
                    :to="{ name: 'users-id', params: { id: note.userId } }"
                  >
                    {{ userName(note.authorId) }}
                  </NuxtLink>
                </div>
                <div>作成日: {{ formattedDate(note.createdAt) }}</div>
              </div>
              <hr />

              <b-card-text>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  class="overflow-auto"
                  v-html="$md.render(note.latestNoteHistory.content)"
                ></div>
                <!-- eslint-enable -->
              </b-card-text>
            </b-card-body>
          </b-card>

          <h5>コメント</h5>
          <b-list-group class="mb-3">
            <b-list-group-item v-for="comment in comments" :key="comment.id">
              <div>
                <div class="text-muted mb-1">
                  <span>
                    <NuxtLink
                      :to="{
                        name: 'users-id',
                        params: { id: comment.authorId },
                      }"
                    >
                      {{ userName(comment.authorId) }}
                    </NuxtLink>
                  </span>
                  <span class="float-right">
                    {{ formattedDate(comment.createdAt) }}
                  </span>
                </div>
                <div style="white-space: pre-line">{{ comment.content }}</div>
              </div>
            </b-list-group-item>
          </b-list-group>

          <h5>コメント投稿</h5>
          <b-form @submit.prevent="onSubmitComment">
            <b-form-textarea
              v-model="commentContent"
              class="mb-3"
              required
            ></b-form-textarea>
            <b-button type="submit" class="float-right" variant="primary"
              >投稿する</b-button
            >
          </b-form>
        </b-col>

        <b-col cols="3">
          <h5>ノート更新履歴</h5>
          <b-list-group>
            <b-list-group-item
              v-for="noteHistory in noteHistoriesAfterFirst"
              :key="noteHistory.id"
            >
              <div
                class="history-item"
                @click="onClickNoteHistory(noteHistory)"
              >
                <div>
                  更新者:
                  <NuxtLink
                    :to="{
                      name: 'users-id',
                      params: { id: noteHistory.userId },
                    }"
                  >
                    {{ userName(noteHistory.authorId) }}
                  </NuxtLink>
                </div>
                <div>更新日: {{ formattedDate(noteHistory.createdAt) }}</div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore } from '@/store'
import firebase from 'firebase'
import { db, FieldValue } from '@/plugins/firebaseApp'
import { INote } from '@/types/note'
import { INoteHistory } from '@/types/noteHistory'
import { IComment } from '@/types/comment'
import { IUser } from '@/types/user'
import { formattedDate } from '@/utils/date-utils'

@Component
export default class NotesIndex extends Vue {
  note: INote | null = null
  noteHistories: INoteHistory[] | null = null
  comments: IComment[] | null = null
  users: IUser[] | null = null
  commentContent: string = ''

  created() {
    const noteId = this.$route.params.id
    this.$bind('note', db.collection('notes').doc(noteId))
    this.$bind(
      'noteHistories',
      db
        .collection('notes')
        .doc(noteId)
        .collection('noteHistories')
        .orderBy('createdAt', 'desc')
    )
    this.$bind(
      'comments',
      db
        .collection('notes')
        .doc(noteId)
        .collection('comments')
        .orderBy('createdAt', 'desc')
    )
    this.$bind('users', db.collection('users'))
  }

  get isShowPage() {
    return this.$route.name === 'notes-id'
  }

  get noteHistoriesAfterFirst() {
    return this.noteHistories ? [...this.noteHistories].slice(0, -1) : []
  }

  formattedDate(timestamp: firebase.firestore.Timestamp) {
    return formattedDate(timestamp)
  }

  userName(userId: string): string {
    const user = this.users?.find((user: IUser) => user.id === userId)
    return user ? user.name : ''
  }

  onClickEdit() {
    this.$router.push({ name: 'notes-id-edit', params: { id: this.note!.id } })
  }

  async onSubmitComment() {
    const comment: Omit<IComment, 'id'> = {
      authorId: authStore.uid!,
      content: this.commentContent,
      createdAt: FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    }
    await this.$firestoreRefs.note.collection('comments').add(comment)
    this.commentContent = ''
  }

  onClickNoteHistory(noteHistory: INoteHistory) {
    const afterNoteHistoryIndex = this.noteHistories!.findIndex(
      (_history) => _history.id === noteHistory.id
    )
    const beforeNoteHistoryIndex = afterNoteHistoryIndex + 1
    const after = this.noteHistories![afterNoteHistoryIndex].id
    const before = this.noteHistories![beforeNoteHistoryIndex].id
    this.$router.push({
      name: 'notes-id-diff',
      params: { id: this.$route.params.id },
      query: { after, before },
    })
  }
}
</script>

<style scoped>
.pencil-icon {
  cursor: pointer;
}

.history-item {
  cursor: pointer;
}
</style>
