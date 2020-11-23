<template>
  <div>
    <b-container v-if="$route.name === 'notes-id'" class="my-3">
      <div v-if="!loading" class="card">
        <div class="card-body">
          <div>
            <h5>{{ latestNoteHistory.title }}</h5>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm mb-3"
              @click="onClickEditButton"
            >
              編集する
            </button>
          </div>
          <div
            class="card-text"
            v-html="$md.render(latestNoteHistory.content)"
          ></div>
        </div>
      </div>
    </b-container>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('notes/show', ['note', 'noteHistories', 'latestNoteHistory']),
    loading() {
      return !this.note || !this.noteHistories
    },
  },
  watch: {
    '$route.name'(newVal, oldVal) {
      if (newVal === 'notes-id' && oldVal === 'notes-id-edit') {
        const id = this.$route.params.id
        this.fetchNote(id)
        this.fetchNoteHistories(id)
      }
    },
  },
  created() {
    const id = this.$route.params.id
    this.fetchNote(id)
    this.fetchNoteHistories(id)
  },
  destroyed() {
    this.resetState()
  },
  methods: {
    ...mapActions('notes/show', [
      'fetchNote',
      'fetchNoteHistories',
      'resetState',
    ]),
    onClickEditButton() {
      this.$router.push({
        name: 'notes-id-edit',
        params: { id: this.$route.params.id },
      })
    },
  },
})
</script>

<style scoped>
.notes-show {
  max-width: 720px;
}
</style>
