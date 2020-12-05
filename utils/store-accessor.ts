/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'

import Auth from '@/store/auth'
import Users from '@/store/users'

let authStore: Auth
let usersStore: Users

function initializeStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  usersStore = getModule(Users, store)
}

export { initializeStores, authStore, usersStore }
