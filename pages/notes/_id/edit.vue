<template>
  <b-container class="flex-fill mb-3 d-flex flex-column">
    <h2 class="text-center">ノート編集</h2>
    <b-form class="flex-fill d-flex flex-column" @submit.prevent="onSubmit">
      <b-form-input
        v-model="title"
        required
        placeholder="Title"
        class="mb-3"
      ></b-form-input>
      <b-form-tags
        v-model="tags"
        placeholder="Tags"
        tag-variant="success"
        add-button-variant="outline-success"
        class="mb-3"
      >
      </b-form-tags>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            v-model="content"
            required
            class="h-100"
            placeholder="Content"
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0 h-100">
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="preview py-2 px-2 mr-3 border rounded"
            v-html="$md.render(content)"
          ></div>
          <!-- eslint-enable -->
        </b-col>
      </b-row>
      <div>
        <b-button
          type="submit"
          variant="primary"
          class="mt-2 float-right not-allowed"
          :disabled="!canSubmit"
          >投稿する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { authStore } from '@/store'
import firebase from 'firebase'
import { db, FieldValue } from '@/plugins/firebaseApp'
import { INote } from '@/types/note'
import { INoteHistory } from '@/types/noteHistory'

@Component
export default class NotesEdit extends Vue {
  title: string = ''
  tags: string[] = []
  content: string = ''
  note: INote | null = null

  get canSubmit(): boolean {
    return this.isFormFullfilled && this.isDiffInNote
  }

  get isFormFullfilled(): boolean {
    return Boolean(this.title.trim()) && Boolean(this.content.trim())
  }

  get isDiffInNote(): boolean {
    return this.isDiffInLatestNoteHistory || this.isDiffInTags
  }

  get isDiffInLatestNoteHistory(): boolean {
    return (
      this.title !== this.note!.latestNoteHistory.title ||
      this.content !== this.note!.latestNoteHistory.content
    )
  }

  get isDiffInTags(): boolean {
    return (
      JSON.stringify([...this.note!.tags].sort()) !==
      JSON.stringify([...this.tags].sort())
    )
  }

  @Watch('note')
  function(newVal: INote, oldVal: INote) {
    if (!oldVal && newVal) {
      this.title = newVal.latestNoteHistory.title
      this.content = newVal.latestNoteHistory.content
      this.tags = [...newVal.tags]
    }
  }

  created() {
    this.$bind('note', db.collection('notes').doc(this.$route.params.id))
  }

  async onSubmit() {
    if (this.isDiffInLatestNoteHistory) {
      const noteHistory: Omit<INoteHistory, 'id'> = {
        authorId: authStore.uid!,
        title: this.title,
        content: this.content,
        createdAt: FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      }
      await this.$firestoreRefs.note.update({
        tags: this.tags,
        latestNoteHistory: noteHistory,
      })
    } else {
      await this.$firestoreRefs.note.update({ tags: this.tags })
    }
    this.$router.push({
      name: 'notes-id',
      params: { id: this.$route.params.id },
    })
  }
}
</script>

<style scoped>
.preview {
  overflow: auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
