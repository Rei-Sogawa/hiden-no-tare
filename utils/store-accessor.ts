/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import Auth from '@/store/auth'
import Notes from '@/store/notes'
import Users from '@/store/users'

let authStore: Auth
let usersStore: Users
let notesStore: Notes

function initializeStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  usersStore = getModule(Users, store)
  notesStore = getModule(Notes, store)
}

export { initializeStores, authStore, usersStore, notesStore }
