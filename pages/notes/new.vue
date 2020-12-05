<template>
  <b-container class="mb-3 d-flex flex-column">
    <h2 class="text-center">ノート新規作成</h2>
    <b-form class="flex-fill d-flex flex-column" @submit.prevent="onSubmit">
      <b-form-input
        v-model="noteForm.title"
        required
        placeholder="Title"
        class="mb-3"
      ></b-form-input>
      <b-form-tags
        v-model="noteForm.tags"
        placeholder="Tag"
        tag-variant="success"
        add-button-variant="outline-success"
        class="mb-3"
      >
      </b-form-tags>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            v-model="noteForm.content"
            required
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
        <b-button type="submit" variant="primary" class="mt-2 float-right"
          >投稿する</b-button
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
export default class NotesNew extends Vue {
  noteForm: INoteForm = {
    title: '',
    tags: [],
    content: '',
  }

  async onSubmit() {
    const note: Note = await notesStore.create(this.noteForm)
    this.$router.push({ name: 'notes-id', params: { id: note.id } })
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
