/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '@/store/auth'

let authStore: Auth

function initializeStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
}

export { initializeStores, authStore }
