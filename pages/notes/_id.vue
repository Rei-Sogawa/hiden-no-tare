<template>
  <div>
    <b-container v-if="isShowPage">
      <b-card no-body class="mb-3">
        <template #header>
          <b-icon
            icon="pencil"
            class="float-right pencil-icon"
            @click="onClickEdit"
          ></b-icon>
        </template>
        <b-card-body>
          <b-card-title>
            {{ findNoteById(noteId).latestHistory.title }}
          </b-card-title>
          <b-card-text>
            <div
              v-html="$md.render(findNoteById(noteId).latestHistory.content)"
            ></div>
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-container>
    <NuxtChild />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('notes', ['findNoteById']),
    noteId() {
      return this.$route.params.id
    },
    isShowPage() {
      return this.$route.name === 'notes-id'
    },
  },
  methods: {
    onClickEdit() {
      this.$router.push({
        name: 'notes-id-edit',
        params: { id: this.noteId },
      })
    },
  },
}
</script>

<style scoped>
.pencil-icon {
  cursor: pointer;
}
</style>
