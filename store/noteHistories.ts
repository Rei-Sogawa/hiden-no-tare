import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

import { db } from '@/plugins/firebaseApp'
import { NoteHistory } from '~/models/noteHistory'

export interface INoteHistoriesState {
  initialized: boolean
  selectedNoteId: string
  storedNoteHistories: NoteHistory[]
  storedNoteHistoriesUnsubscribe?: () => void
}

@Module({ stateFactory: true, namespaced: true, name: 'noteHistories' })
export default class NoteHistories
  extends VuexModule
  implements INoteHistoriesState {
  initialized: boolean = false
  selectedNoteId: string = ''
  storedNoteHistories: NoteHistory[] = []
  storedNoteHistoriesUnsubscribe?: () => void = undefined

  get noteHistoriesRef() {
    if (this.selectedNoteId !== '') {
      return db.collection(`notes/${this.selectedNoteId}/noteHistories`)
    }
  }

  get noteHistories() {
    return [...this.storedNoteHistories].sort((a, b) =>
      b.createdAt && a.createdAt ? b.createdAt.seconds - a.createdAt.seconds : 0
    )
  }

  get noteHistoriesAfterFirst() {
    return [...this.noteHistories].slice(0, -1)
  }

  @Mutation
  SET_INITIALIZED(value: boolean) {
    this.initialized = value
  }

  @Mutation
  SET_SELECTED_NOTE_ID(value: string) {
    this.selectedNoteId = value
  }

  @Mutation
  SET_NOTE_HISTORIES_UNSUBSCRIBE(value?: () => void) {
    this.storedNoteHistoriesUnsubscribe = value
  }

  @Mutation
  CLEAR_STATE() {
    if (this.storedNoteHistoriesUnsubscribe) {
      this.storedNoteHistoriesUnsubscribe()
    }
    this.storedNoteHistoriesUnsubscribe = undefined
    this.initialized = false
    this.selectedNoteId = ''
    this.storedNoteHistories = []
  }

  @Mutation
  STORE_NOTE_HISTORY(noteHistory: NoteHistory) {
    this.storedNoteHistories = this.storedNoteHistories.filter(
      (storedNoteHistory) => storedNoteHistory.id !== noteHistory.id
    )
    this.storedNoteHistories.push(noteHistory)
  }

  @Mutation
  REMOVE_NOTE_HISTORY(noteHistory: NoteHistory) {
    this.storedNoteHistories = this.storedNoteHistories.filter(
      (storedNoteHistory) => storedNoteHistory.id !== noteHistory.id
    )
  }

  @Action
  async initialize(noteId: string) {
    if (this.initialized) {
      return
    }
    this.SET_SELECTED_NOTE_ID(noteId)
    await this.storeNoteHistories()
    this.watchNotesHistories()
    this.SET_INITIALIZED(true)
  }

  @Action
  async storeNoteHistories() {
    const querySnapshot = await this.noteHistoriesRef!.get()
    querySnapshot.forEach((doc) => {
      const noteHistory = new NoteHistory({ id: doc.id, ...doc.data() })
      this.STORE_NOTE_HISTORY(noteHistory)
    })
  }

  @Action
  watchNotesHistories() {
    const unsubscribe = this.noteHistoriesRef!.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const noteHistory = new NoteHistory({
          id: change.doc.id,
          ...change.doc.data(),
        })
        if (change.type === 'added' || change.type === 'modified') {
          this.STORE_NOTE_HISTORY(noteHistory)
        } else if (change.type === 'removed') {
          this.REMOVE_NOTE_HISTORY(noteHistory)
        }
      })
    })
    this.SET_NOTE_HISTORIES_UNSUBSCRIBE(unsubscribe)
  }

  @Action
  clear() {
    this.CLEAR_STATE()
  }
}
