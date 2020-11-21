export default {
  notes: (state) => state.notes,
  noteHistories: (state) => state.noteHistories,
  noteHistoryById: (state) => (id) =>
    state.noteHistories.find((noteHistory) => noteHistory.note_id === id),
}
