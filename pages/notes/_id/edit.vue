<template>
  <b-container v-if="!loading" class="h-100 py-3 d-flex flex-column">
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
          :disabled="isButtonDisabled"
          >更新する</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

import firebase from '@/plugins/firebase'
const db = firebase.firestore()
// const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

// const getNote = async (id) => {
//   const noteDoc = await notesRef.doc(id).get()
//   return { id: notesRef.id, ...noteDoc.data() }
// }
const getLatestNoteHistory = async (id) => {
  const noteHistoriesSnapshot = await noteHistoriesRef
    .where('note_id', '==', id)
    .orderBy('created_at', 'desc')
    .limit(1)
    .get()
  const noteHistoryDoc = noteHistoriesSnapshot.docs[0]
  return { id: noteHistoryDoc.id, ...noteHistoryDoc.data() }
}
const createNoteHistory = async (id, title, content) => {
  return noteHistoriesRef.add({
    title,
    content,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
    note_id: id,
  })
}

export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
      latestNoteHistory: null,
    }
  },
  computed: {
    loading() {
      return !this.latestNoteHistory
    },
    isButtonDisabled() {
      return (
        this.title === this.latestNoteHistory.title &&
        this.content === this.latestNoteHistory.content
      )
    },
  },
  async created() {
    const latestNoteHistory = await getLatestNoteHistory(this.$route.params.id)
    this.latestNoteHistory = latestNoteHistory
    this.title = latestNoteHistory.title
    this.content = latestNoteHistory.content
  },
  methods: {
    async onClickUpdateButton() {
      await createNoteHistory(this.$route.params.id, this.title, this.content)
      this.$router.push({
        name: 'notes-id',
        params: { id: this.$route.params.id },
      })
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
