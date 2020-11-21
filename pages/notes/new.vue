<template>
  <b-container class="my-3 d-flex flex-column">
    <h2 class="text-center">新規投稿</h2>
    <b-form
      class="flex-fill d-flex flex-column"
      @submit.prevent="onPostButtonClick"
    >
      <b-form-input
        :value="title"
        placeholder="Title"
        required
        class="mb-3"
        @input="updateTitle"
      ></b-form-input>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            :value="content"
            class="h-100"
            placeholder="Content"
            @input="updateContent"
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0 h-100">
          <div
            class="preview py-2 px-2 mr-3 border rounded"
            v-html="$md.render(content)"
          ></div>
        </b-col>
      </b-row>
      <div>
        <b-button type="submit" variant="success" class="mt-2 float-right"
          >投稿する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('notes/new', ['title', 'content']),
  },
  destroyed() {
    this.resetState()
  },
  methods: {
    ...mapMutations('notes/new', ['SET_TITLE', 'SET_CONTENT']),
    ...mapActions('notes/new', ['createNote', 'resetState']),
    updateTitle(title) {
      this.SET_TITLE(title)
    },
    updateContent(content) {
      this.SET_CONTENT(content)
    },
    async onPostButtonClick() {
      const noteHistoryRef = await this.createNote()
      const noteHistoryDoc = await noteHistoryRef.get()
      const noteId = noteHistoryDoc.data().note_id
      this.$router.push({ name: 'notes-id', params: { id: noteId } })
    },
  },
})
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
