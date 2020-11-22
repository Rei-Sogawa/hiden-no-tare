import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
  createNote: async (context) => {
    const noteRef = await notesRef.add({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    return noteHistoriesRef.add({
      title: context.state.title,
      content: context.state.content,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      note_id: noteRef.id,
    })
  },
  resetState: (context) => {
    context.commit('SET_TITLE', '')
    context.commit('SET_CONTENT', '')
  },
}
