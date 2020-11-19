import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
  async createNote(context) {
    const res = await notesRef.add({
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    })
    return noteHistoriesRef.add({
      note_id: res.id,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      ...context.state.note,
    })
  },
}
