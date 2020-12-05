import firebase from 'firebase'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

import { User } from '@/models/user'
import { db } from '@/plugins/firebaseApp'

import { authStore } from '.'

const usersRef = db.collection('users')

export interface IUserState {
  initialized: boolean
  storedUsers: User[]
  storedUsersUnsubscribe?: () => void
}

@Module({ stateFactory: true, namespaced: true, name: 'users' })
export default class Users extends VuexModule implements IUserState {
  initialized: boolean = false
  storedUsers: User[] = []
  storedUsersUnsubscribe?: () => void = undefined

  get currentUser() {
    return this.storedUsers.find((user) => user.id === authStore.uid)
  }

  get findUserById() {
    return (id: string) => this.storedUsers.find((user: User) => user.id === id)
  }

  @Mutation
  SET_INITIALIZED(value: boolean) {
    this.initialized = value
  }

  @Mutation
  SET_USERS_UNSUBSCRIBE(value?: () => void) {
    this.storedUsersUnsubscribe = value
  }

  @Mutation
  CLEAR_STATE() {
    if (this.storedUsersUnsubscribe) {
      this.storedUsersUnsubscribe()
    }
    this.storedUsersUnsubscribe = undefined
    this.initialized = false
    this.storedUsers = []
  }

  @Mutation
  STORE_USER(user: User) {
    this.storedUsers = this.storedUsers.filter(
      (storedUser) => storedUser.id !== user.id
    )
    this.storedUsers.push(user)
  }

  @Mutation
  REMOVE_USER(user: User) {
    this.storedUsers = this.storedUsers.filter(
      (storedUser) => storedUser.id !== user.id
    )
  }

  @Action
  async initialize() {
    if (this.initialized) {
      return true
    }
    await this.storeUsers()
    this.watchUsers()
    this.SET_INITIALIZED(true)
  }

  @Action
  async storeUsers() {
    const querySnapshot = await usersRef.get()
    querySnapshot.forEach((doc) => {
      const user = new User({ id: doc.id, ...doc.data() })
      this.STORE_USER(user)
    })
  }

  @Action
  watchUsers() {
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const user = new User({ id: change.doc.id, ...change.doc.data() })
        if (change.type === 'added' || change.type === 'modified') {
          this.STORE_USER(user)
        } else if (change.type === 'removed') {
          this.REMOVE_USER(user)
        }
      })
    })
    this.SET_USERS_UNSUBSCRIBE(unsubscribe)
  }

  // users collection に対する CRUD 操作
  @Action
  update(firebaseUser: firebase.User) {
    const { uid, displayName, photoURL } = firebaseUser
    return usersRef.doc(uid).set({ displayName, photoURL })
  }
}
