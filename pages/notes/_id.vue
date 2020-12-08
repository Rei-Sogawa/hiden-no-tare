<template>
  <div>
    <b-container v-if="isShowPage">
      <b-row>
        <b-col cols="9">
          <h5>ノート</h5>
          <b-card no-body class="mb-3">
            <template #header>
              <b-icon
                icon="pencil"
                class="float-right cursor-pointer"
                @click="onClickEdit"
              ></b-icon>
            </template>
            <b-card-body>
              <b-card-title>
                <h1>
                  {{ note.latestHistory.title }}
                </h1>
              </b-card-title>

              <div class="mb-3">
                <b-badge
                  v-for="(tag, index) in note.latestHistory.tags"
                  :key="index"
                  class="mr-1"
                  variant="success"
                  >{{ tag }}</b-badge
                >
              </div>
              <hr />

              <div class="text-muted mb-1 clearfix">
                <span class="float-left">
                  <div>
                    作成者:
                    <NuxtLink
                      :to="{ name: 'users-id', params: { id: note.authorId } }"
                    >
                      {{ userName(note.authorId) }}
                    </NuxtLink>
                  </div>
                </span>
                <span class="float-right">
                  <div>作成日: {{ formatDate(note.createdAt) }}</div>
                </span>
              </div>
              <hr />

              <b-card-text>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  class="overflow-auto"
                  v-html="$md.render(note.latestHistory.content)"
                ></div>
                <!-- eslint-enable -->
              </b-card-text>
            </b-card-body>
          </b-card>
        </b-col>

        <b-col cols="3">
          <h5>ノート更新履歴</h5>
          <b-list-group>
            <b-list-group-item
              v-for="history in noteHistoriesAfterFirst"
              :key="history.id"
            >
              <div class="cursor-pointer" @click="onClickHistory(history)">
                <div>
                  {{ userName(history.authorId) }}
                </div>
                <div>
                  {{ history.createdAt ? formatDate(history.createdAt) : '' }}
                </div>
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
import firebase from 'firebase'
import { Component, Vue } from 'nuxt-property-decorator'

import { noteHistoriesStore, notesStore, usersStore } from '@/store'
import { formattedYearDateTime } from '@/utils/date-utils'

@Component
export default class NotesShow extends Vue {
  created() {
    noteHistoriesStore.initialize(this.id)
  }

  beforeDestroy() {
    noteHistoriesStore.clear()
  }

  get isShowPage() {
    return this.$route.name === 'notes-id'
  }

  get id() {
    return this.$route.params.id
  }

  get note() {
    return notesStore.findNoteById(this.id)
  }

  get noteHistories() {
    return noteHistoriesStore.noteHistories
  }

  get noteHistoriesAfterFirst() {
    return noteHistoriesStore.noteHistoriesAfterFirst
  }

  userName(userId: string) {
    const user = usersStore.findUserById(userId)
    return user ? user.displayName : ''
  }

  formatDate(timestamp: firebase.firestore.Timestamp) {
    return formattedYearDateTime(timestamp)
  }

  onClickEdit() {
    this.$router.push({ name: 'notes-id-edit', params: { id: this.id } })
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
