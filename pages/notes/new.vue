<template>
  <div class="container">
    <b-form class="d-flex flex-column h-100" @submit.prevent="onPostClick">
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
        <b-button type="submit" variant="success" class="my-2 float-right"
          >Post</b-button
        >
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
    }
  },
  methods: {
    onPostClick() {
      console.log('call onPostClick')
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
