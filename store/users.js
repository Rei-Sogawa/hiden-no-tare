import firebase from '@/plugins/firebase'
const provider = new firebase.auth.GoogleAuthProvider()
const db = firebase.firestore()
const usersRef = db.collection('users')

const state = () => ({
  currentUser: null,
})

const getters = {
  currentUser: (state) => state.currentUser,
  isLoggedIn: (state) => state.currentUser !== null,
}

const mutations = {
  SET_CURRENT_USER: (state, user) => {
    state.currentUser = user
  },
}

const actions = {
  setCurrentUser: (context, currentUser) => {
    context.commit('SET_CURRENT_USER', currentUser)
  },
  signIn: (_) => {
    return firebase.auth().signInWithPopup(provider)
  },
  signOut: (_) => {
    return firebase.auth().signOut()
  },
  getUser: (_, uid) => {
    return usersRef.doc(uid).get()
  },
  createUser: (_, { uid, displayName }) => {
    return usersRef.doc(uid).set({ displayName })
  },
}

export { state, getters, mutations, actions }
