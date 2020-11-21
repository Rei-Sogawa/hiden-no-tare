export default {
  note: (state) => state.note,
  noteHistories: (state) => state.noteHistories,
  latestNoteHistory: (state) => state.noteHistories[0],
}
