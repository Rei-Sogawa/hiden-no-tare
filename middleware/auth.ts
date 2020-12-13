import { Context } from '@nuxt/types'
import { authStore } from '@/store'
import { auth } from '@/plugins/firebaseApp'
import firebase from 'firebase'

export default async ({ route, redirect }: Context) => {
  if (!authStore.isSignedIn) {
    const authenticatedUser: firebase.User | null = await new Promise(
      (resolve): void => {
        auth.onAuthStateChanged((authenticatedUser): void => {
          resolve(authenticatedUser)
        })
      }
    )
    if (authenticatedUser) {
      authStore.doSignIn(authenticatedUser)
    }
  }

  if (authStore.isSignedIn && route.name === 'index') {
    return redirect({ name: 'notes' })
  }
  if (!authStore.isSignedIn && route.name !== 'index') {
    return redirect({ name: 'index' })
  }
}
