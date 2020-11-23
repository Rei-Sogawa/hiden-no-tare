<template>
  <b-container class="my-3 d-flex flex-column">
    <h2 class="text-center">ノートの投稿</h2>
    <b-form
      class="flex-fill d-flex flex-column"
      @submit.prevent="onClickPostButton"
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
        <b-button type="submit" variant="success" class="mt-2 float-right"
          >投稿する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
    }
  },
  methods: {
    ...mapActions('notes/new', ['createNote']),
    async onClickPostButton() {
      const noteId = await this.createNote({
        title: this.title,
        content: this.content,
      })
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
