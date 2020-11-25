export default {
  notesListener: (state) => state.noteListener,
  noteHistoriesListener: (state) => state.noteHistoriesListener,
  notes: (state) => state.notes,
  note: (state) => (id) => state.notes.find((note) => note.id === id),
  noteHistories: (state) => state.noteHistories,
  latestNoteHistory: (state) => (noteId) =>
    state.noteHistories.find((noteHistory) => noteHistory.note_id === noteId),
}
