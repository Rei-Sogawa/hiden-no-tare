import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const notesRef = db.collection('notes')
const noteHistoriesRef = db.collection('note_histories')

export default {
  async getNotes() {
    const noteDocs = (await notesRef.orderBy('created_at', 'desc').get()).docs
    const getNoteHistoryDocsArray = noteDocs.map((noteDoc) =>
      noteHistoriesRef
        .where('note_id', '==', noteDoc.id)
        .orderBy('created_at', 'desc')
        .limit(1)
        .get()
    )
    const noteHistoryDocsArray = await Promise.all(getNoteHistoryDocsArray)
    return noteHistoryDocsArray.map((noteHistoryDocs) =>
      noteHistoryDocs.docs[0].data()
    )
  },
  async fetchNotes(context) {
    const notes = await context.dispatch('getNotes')
    console.log(notes)
  },
}
