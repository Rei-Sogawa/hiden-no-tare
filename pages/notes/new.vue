<template>
  <b-container>
    <b-form
      class="d-flex flex-column h-100"
      @submit.prevent="onPostButtonClick"
    >
      <b-form-input
        :value="note.title"
        placeholder="Title"
        required
        class="mb-3"
        @input="updateTitle"
      ></b-form-input>
      <b-row class="flex-fill">
        <b-col class="pr-0">
          <b-form-textarea
            :value="note.content"
            class="h-100"
            placeholder="Content"
            @input="updateContent"
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0 h-100">
          <div
            class="preview py-2 px-2 mr-3 border rounded"
            v-html="$md.render(note.content)"
          ></div>
        </b-col>
      </b-row>
      <div>
        <b-button type="submit" variant="success" class="my-2 float-right"
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
    ...mapGetters('note', ['note']),
  },
  methods: {
    ...mapMutations('note', ['SET_NOTE']),
    ...mapActions('note', ['createNote']),
    onPostButtonClick() {
      this.createNote().then((res) => {
        console.log(res)
      })
    },
    updateTitle(title: string): void {
      this.SET_NOTE(Object.assign({}, this.note, { title }))
    },
    updateContent(content: string): void {
      this.SET_NOTE(Object.assign({}, this.note, { content }))
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
