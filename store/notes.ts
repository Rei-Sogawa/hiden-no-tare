import firebase from 'firebase'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'

import { INoteForm, Note } from '@/models/note'
import { NoteHistory } from '@/models/noteHistory'
import { db, FieldValue } from '@/plugins/firebaseApp'

import { authStore } from '.'

const notesRef = db.collection('notes')

export interface INotesState {
  initialized: boolean
  storedNotes: Note[]
  storedNotesUnsubscribe?: () => void
}

@Module({ stateFactory: true, namespaced: true, name: 'notes' })
export default class Notes extends VuexModule implements INotesState {
  initialized: boolean = false
  storedNotes: Note[] = []
  storedNotesUnsubscribe?: () => void = undefined

  get notes() {
    return [...this.storedNotes].sort((a, b) =>
      b.updatedAt && a.updatedAt ? b.updatedAt.seconds - a.updatedAt.seconds : 0
    )
  }

  get findNoteById(): (id: string) => Note | undefined {
    return (id: string) => this.storedNotes.find((note) => note.id === id)
  }

  // [tagName, tag 数][]
  // を tag 数が多い順に並べたもの
  get tags(): [string, number][] {
    const tagNames: string[] = this.storedNotes.reduce(
      (pre, curr) => pre.concat(curr.tags),
      [] as string[]
    )
    const uniqueTagNames: string[] = tagNames.filter(
      (x, i, self) => self.indexOf(x) === i
    )
    const tagNameAndCount: [
      string,
      number
    ][] = uniqueTagNames.map((tagName) => [
      tagName,
      tagNames.filter((_tagName) => _tagName === tagName).length,
    ])
    return tagNameAndCount.sort((a, b) => b[1] - a[1])
  }

  get notesFilterByTag() {
    return (tag: string) =>
      this.storedNotes.filter((note) => note.tags.includes(tag))
  }

  @Mutation
  SET_INITIALIZED(value: boolean) {
    this.initialized = value
  }

  @Mutation
  SET_NOTES_UNSUBSCRIBE(value?: () => void) {
    this.storedNotesUnsubscribe = value
  }

  @Mutation
  CLEAR_STATE() {
    if (this.storedNotesUnsubscribe) {
      this.storedNotesUnsubscribe()
    }
    this.storedNotesUnsubscribe = undefined
    this.initialized = false
    this.storedNotes = []
  }

  @Mutation
  STORE_NOTE(note: Note) {
    this.storedNotes = this.storedNotes.filter(
      (storedNote) => storedNote.id !== note.id
    )
    this.storedNotes.push(note)
  }

  @Mutation
  REMOVE_NOTE(note: Note) {
    this.storedNotes = this.storedNotes.filter(
      (storedNote) => storedNote.id !== note.id
    )
  }

  @Action
  async initialize() {
    if (this.initialized) {
      return true
    }
    await this.storeNotes()
    this.watchNotes()
    this.SET_INITIALIZED(true)
  }

  @Action
  async storeNotes() {
    const querySnapshot = await notesRef.orderBy('updatedAt', 'desc').get()
    querySnapshot.forEach((doc) => {
      const note = new Note({ id: doc.id, ...doc.data() })
      this.STORE_NOTE(note)
    })
  }

  @Action
  watchNotes() {
    const unsubscribe = notesRef
      .orderBy('updatedAt', 'desc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const note = new Note({ id: change.doc.id, ...change.doc.data() })
          if (change.type === 'added' || change.type === 'modified') {
            this.STORE_NOTE(note)
          } else if (change.type === 'removed') {
            this.REMOVE_NOTE(note)
          }
        })
      })
    this.SET_NOTES_UNSUBSCRIBE(unsubscribe)
  }

  // notes collection に対する CRUD 操作
  @Action
  // notes/${noteId}/noteHistories に対する Create も行う必要がある
  // cloud function の firestore trigger を使う？
  create(noteForm: INoteForm) {
    const noteHistory = new NoteHistory({
      title: noteForm.title,
      content: noteForm.content,
      authorId: authStore.uid!,
    })
    const note = new Note({
      tags: noteForm.tags,
      latestHistory: noteHistory.toObject(),
      authorId: authStore.uid!,
    })
    const noteRef = notesRef.doc()
    note.id = noteRef.id
    const noteHistoriesRef = noteRef.collection('noteHistories')
    return Promise.all([
      noteRef.set(note.toObject()),
      noteHistoriesRef.add(noteHistory.toObject()),
    ]).then(() => {
      return note
    })
  }

  @Action
  update(payload: { id: string; noteForm: INoteForm }) {
    const { id, noteForm } = payload
    const noteHistory = new NoteHistory({
      title: noteForm.title,
      content: noteForm.content,
      authorId: authStore.uid!,
    })
    const note: Note = this.findNoteById(id) as Note
    const updatedNote: Note = new Note(note.toObject())
    updatedNote.tags = noteForm.tags
    updatedNote.latestHistory = noteHistory.toObject()
    updatedNote.updatedAt = FieldValue.serverTimestamp() as firebase.firestore.Timestamp
    return Promise.all([
      notesRef.doc(id).update(updatedNote.toObject()),
      notesRef.doc(id).collection('noteHistories').add(noteHistory.toObject()),
    ])
  }

  @Action
  updateOnlyTag(payload: { id: string; noteForm: INoteForm }) {
    const { id, noteForm } = payload
    return notesRef.doc(id).update({ tags: noteForm.tags })
  }
}
