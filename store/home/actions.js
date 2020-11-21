import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
  async getNotes() {
    const noteDocs = (await notesRef.orderBy('created_at', 'desc').get()).docs
    const noteHistoryQueries = noteDocs.map((noteDoc) =>
      noteHistoriesRef
        .where('note_id', '==', noteDoc.id)
        .orderBy('created_at', 'desc')
        .limit(1)
        .get()
    )
    const noteHistorySnapshots = await Promise.all(noteHistoryQueries)
    const notes = noteHistorySnapshots.map((snapshot) =>
      snapshot.docs[0].data()
    )
    return notes
  },
  async fetchNotes(context) {
    const notes = await context.dispatch('getNotes')
    context.commit('SET_NOTES', notes)
  },
}
