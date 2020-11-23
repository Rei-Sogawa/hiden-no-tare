export default {
  SET_NOTES_LISTENER: (state, notesListener) => {
    state.notesListener = notesListener
  },
  SET_NOTE_HISTORIES_LISTENER: (state, noteHistoriesListener) => {
    state.noteHistoriesListener = noteHistoriesListener
  },
  SET_NOTES: (state, notes) => {
    state.notes = notes
  },
  SET_NOTE_HISTORIES: (state, noteHistories) => {
    state.noteHistories = noteHistories
  },
}
