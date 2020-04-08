import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import { addNote, swapNote, deleteNote, syncState } from 'actions'
import { NoteItem, CategoryItem, ApplicationState } from 'types'
import { getNoteTitle, downloadNote } from 'helpers'
import { useKey } from 'helpers/hooks'
import moment from 'moment'

interface NavigationProps {
  addNote: (note: NoteItem) => void
  swapNote: (noteId: string) => void
  deleteNote: (noteId: string) => void
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
  activeNote?: NoteItem
  notes: NoteItem[]
  categories: CategoryItem[]
  syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  activeNote,
  addNote,
  swapNote,
  deleteNote,
  syncState,
  notes,
  categories,
  syncing,
}) => {
  const newNoteHandler = () => {
    const note: NoteItem = {
      id: uuid(),
      text: '',
      created: moment().format(),
      lastUpdated: moment().format(),
    }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const deleteNoteHandler = () => {
    if (activeNote) {
      deleteNote(activeNote.id)
    }
  }

  const syncNotesHandler = () => {
    syncState(notes, categories)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote.text)
    }
  }

  useKey('ctrl+n', () => {
    newNoteHandler()
  })

  useKey('ctrl+backspace', () => {
    deleteNoteHandler()
  })

  useKey('ctrl+w', () => {
    deleteNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNotesHandler()
  })

  // useKey('ctrl+up', () => {
  //   swapNote()
  // })

  return (
    <nav className="navigation">
      <button className="nav-button" onClick={newNoteHandler}>
        + New Note
      </button>
      <button className="nav-button" onClick={deleteNoteHandler}>
        X Delete Note
      </button>
      <button className="nav-button" onClick={downloadNoteHandler}>
        ^ Download Note
      </button>
      <button className="nav-button" onClick={syncNotesHandler}>
        Sync notes
        {syncing && 'Syncing...'}
      </button>
    </nav>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  syncing: state.syncState.syncing,
  notes: state.noteState.notes,
  categories: state.categoryState.categories,
  activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  deleteNote: (noteId: string) => dispatch(deleteNote(noteId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
