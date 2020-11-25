<template>
  <b-container class="h-100 pb-3 d-flex flex-column">
    <h2 class="text-center">ノートの更新</h2>
    <b-form
      class="flex-fill d-flex flex-column"
      @submit.prevent="onClickUpdateButton"
    >
      <b-form-input
        v-model="title"
        placeholder="Title"
        required
        class="mb-3"
      ></b-form-input>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            v-model="content"
            class="h-100"
            placeholder="Content"
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
        <b-button
          type="submit"
          variant="success"
          class="mt-2 float-right"
          :disabled="!hasDifference"
          >更新する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      title: '',
      content: '',
    }
  },
  computed: {
    ...mapGetters('notes', ['findNoteById']),
    noteId() {
      return this.$route.params.id
    },
    hasDifference() {
      const { title, content } = this.findNoteById(this.noteId).latestHistory
      return this.title !== title || this.content !== content
    },
  },
  created() {
    const { title, content } = this.findNoteById(this.noteId).latestHistory
    this.title = title
    this.content = content
  },
  methods: {
    ...mapActions('notes', ['updateNote']),
    async onClickUpdateButton() {
      await this.updateNote({
        id: this.noteId,
        title: this.title,
        content: this.content,
      })
      this.$router.push({
        name: 'notes-id',
        params: { id: this.noteId },
      })
    },
  },
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
