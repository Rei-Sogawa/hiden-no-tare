import firebase from 'firebase'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

import { auth, GoogleAuthProvider } from '@/plugins/firebaseApp'

export interface IAuthState {
  uid: string | null
}

@Module({ stateFactory: true, namespaced: true, name: 'auth' })
export default class Auth extends VuexModule implements IAuthState {
  uid: string | null = null

  @Mutation
  SET_UID(val: string | null) {
    this.uid = val
  }

  get isSignedIn(): boolean {
    return !!this.uid
  }

  @Action
  signIn() {
    return auth.signInWithPopup(GoogleAuthProvider)
  }

  @Action
  signOut() {
    return auth.signOut()
  }

  @Action
  doSignIn(firebaseUser: firebase.User) {
    const { uid } = firebaseUser
    this.SET_UID(uid)
  }

  @Action
  doSignOut() {
    this.SET_UID(null)
  }
}
