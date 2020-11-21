import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

const getNote = async (id) => {
  const noteDoc = await notesRef.doc(id).get()
  return { id: noteDoc.id, ...noteDoc.data() }
}
const getNoteHistories = async (id) => {
  const noteHistoriesSnapshot = await noteHistoriesRef
    .where('note_id', '==', id)
    .orderBy('created_at', 'desc')
    .get()
  const noteHistoriesDocs = noteHistoriesSnapshot.docs
  const noteHistories = noteHistoriesDocs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  return noteHistories
}

export default {
  async fetchNote(context, id) {
    const note = await getNote(id)
    context.commit('SET_NOTE', note)
  },
  async fetchNoteHistories(context, id) {
    const noteHistories = await getNoteHistories(id)
    context.commit('SET_NOTE_HISTORIES', noteHistories)
  },
  resetState(context) {
    context.commit('SET_NOTE', null)
    context.commit('SET_NOTE_HISTORIES', null)
  },
}
