<template>
  <div>
    <b-container v-if="isShowPage">
      <b-card no-body class="mb-3">
        <template #header>
          <b-icon
            icon="pencil"
            class="float-right pencil-icon"
            @click="onClickPencilIcon"
          ></b-icon>
        </template>
        <b-card-body>
          <b-card-title>
            {{ latestNoteHistory(noteId).title }}
          </b-card-title>
          <b-card-text>
            <div v-html="$md.render(latestNoteHistory(noteId).content)"></div>
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
    ...mapGetters('notes', ['latestNoteHistory']),
    noteId() {
      return this.$route.params.id
    },
    isShowPage() {
      return this.$route.name === 'notes-id'
    },
  },
  methods: {
    onClickPencilIcon() {
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
