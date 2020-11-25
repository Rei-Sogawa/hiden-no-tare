import firebase from '@/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

const state = () => ({
  notes: [],
})

const getters = {
  notes: (state) => state.notes,
  findNoteById: (state) => (id) => state.notes.find((note) => note.id === id),
  notesListener: (state) => state.notesListener,
}

const mutations = {
  SET_NOTES: (state, notes) => {
    state.notes = notes
  },
  SET_NOTES_LISTENER: (state, listener) => {
    state.notesListener = listener
  },
}

const actions = {
  subscribeNotes: (context) => {
    const listener = notesRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const notes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ref: doc.ref,
          ...doc.data(),
        }))
        context.commit('SET_NOTES', notes)
      })
    context.commit('SET_NOTES_LISTENER', listener)
  },
  createNote: async (context, { title, content }) => {
    const latestHistory = {
      title,
      content,
      userId: context.rootGetters['users/currentUser'].id,
      createdAt: serverTimestamp(),
    }
    const { id } = await notesRef.add({
      createdAt: serverTimestamp(),
      latestHistory,
    })
    return id
  },
  updateNote: async (context, { id, title, content }) => {
    const prevLatestHistory = context.getters.findNoteById(id).latestHistory
    const latestHistory = {
      title,
      content,
      userId: context.rootGetters['users/currentUser'].id,
      createdAt: serverTimestamp(),
    }
    await notesRef.doc(id).update({ latestHistory })
    await notesRef.doc(id).collection('histories').add(prevLatestHistory)
  },
}

export { state, getters, mutations, actions }
