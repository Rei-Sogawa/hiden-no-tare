<template>
  <div class="h-100 d-flex flex-column">
    <TheHeader />
    <Nuxt v-if="isLoggedIn" class="flex-fill" />
    <div v-else class="text-center">
      <h1>Hiden no Tare</h1>
    </div>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader'
import firebase from '@/plugins/firebase'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TheHeader,
  },
  computed: {
    ...mapGetters('users', ['isLoggedIn']),
  },
  created() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const { uid, displayName } = user
        const snapshot = await this.getUser(uid)
        if (!snapshot.exists) {
          await this.createUser({ uid, displayName })
        }
        await this.setCurrentUser({ displayName })
      } else {
        this.setCurrentUser(null)
      }
    })
  },
  methods: {
    ...mapActions('users', ['setCurrentUser', 'getUser', 'createUser']),
  },
}
</script>

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}
</style>
