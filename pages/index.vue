<template>
  <b-container class="home">
    <TheHeader class="my-3" />
    <h1 class="text-center">Hiden no Tare</h1>
    <b-list-group>
      <b-list-group-item v-for="note in notes" :key="note.note_id">
        {{ note.title }}
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  components: { TheHeader },
  computed: {
    ...mapGetters('home', ['notes']),
  },
  created() {
    this.fetchNotes()
  },
  methods: {
    ...mapActions('home', ['fetchNotes']),
  },
})
</script>

<style scoped>
.home {
  max-width: 720px;
}
</style>
