<template>
  <b-container class="h-100 pb-3 d-flex flex-column">
    <h2 class="text-center">ノート更新</h2>
    <b-form class="flex-fill d-flex flex-column" @submit.prevent="onSubmit">
      <b-form-input
        v-model="noteForm.title"
        placeholder="Title"
        required
        class="mb-3"
      ></b-form-input>
      <b-form-tags
        v-model="noteForm.tags"
        placeholder="Tag"
        tag-variant="success"
        class="mb-3"
      ></b-form-tags>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            v-model="noteForm.content"
            class="h-100"
            placeholder="Content"
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0 h-100">
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="preview py-2 px-2 mr-3 border rounded"
            v-html="$md.render(noteForm.content)"
          ></div>
          <!-- eslint-enable -->
        </b-col>
      </b-row>
      <div>
        <b-button
          type="submit"
          variant="primary"
          class="mt-2 float-right"
          :disabled="!hasDiff"
          >更新する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import { INoteForm, Note } from '@/models/note'
import { notesStore } from '@/store'

@Component
export default class NotesEdit extends Vue {
  noteForm: INoteForm = {
    title: '',
    tags: [],
    content: '',
  }

  get id() {
    return this.$route.params.id
  }

  get note() {
    return notesStore.findNoteById(this.id)
  }

  get hasDiff() {
    return this.hasNoteDiff || this.hasNoteHistoryDiff
  }

  get hasNoteDiff() {
    return this.note
      ? JSON.stringify([...this.note.tags].sort()) !==
          JSON.stringify([...this.noteForm.tags].sort())
      : false
  }

  get hasNoteHistoryDiff() {
    return this.note
      ? this.note.latestHistory.title !== this.noteForm.title ||
          this.note.latestHistory.content !== this.noteForm.content
      : false
  }

  mounted() {
    this.noteForm.title = this.note!.latestHistory.title!
    this.noteForm.tags = this.note!.tags!
    this.noteForm.content = this.note!.latestHistory.content!
  }

  async onSubmit() {
    if (!this.hasNoteHistoryDiff) {
      await notesStore.updateOnlyTag({ id: this.id, noteForm: this.noteForm })
    } else {
      await notesStore.update({ id: this.id, noteForm: this.noteForm })
    }
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
