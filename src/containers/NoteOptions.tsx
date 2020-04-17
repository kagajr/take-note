import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Download, Trash, Bookmark } from 'react-feather'
import { sendNoteToTrash, bookmarkNote } from 'actions'
import { NoteItem, ApplicationState } from 'types'
import { getNoteTitle, downloadNote } from 'helpers'

interface NoteOptionsProps {
  sendNoteToTrash: (noteId: string) => void
  bookmarkNote: (noteId: string) => void
  clickedNote: NoteItem
}

const NoteOptions: React.FC<NoteOptionsProps> = ({
  sendNoteToTrash,
  bookmarkNote,
  clickedNote,
}) => {
  const trashNoteHandler = () => {
    if (clickedNote && !clickedNote.trash) {
      sendNoteToTrash(clickedNote.id)
    }
  }

  const downloadNoteHandler = () => {
    if (clickedNote) {
      downloadNote(getNoteTitle(clickedNote.text), clickedNote)
    }
  }

  const bookmarkNoteHandler = () => {
    if (clickedNote) {
      bookmarkNote(clickedNote.id)
    }
  }

  return (
    <nav className="note-options-nav">
      <div className="nav-button" onClick={trashNoteHandler}>
        <Trash size={15} />
        Delete Note
      </div>
      <div className="nav-button" onClick={downloadNoteHandler}>
        <Download size={15} />
        Download note
      </div>
      {!clickedNote.trash && (
        <div className="nav-button" onClick={bookmarkNoteHandler}>
          <Bookmark size={15} />
          {clickedNote.bookmark ? 'Remove bookmark' : 'Bookmark'}
        </div>
      )}
    </nav>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  activeCategoryId: state.noteState.activeCategoryId,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  sendNoteToTrash: (noteId: string) => dispatch(sendNoteToTrash(noteId)),
  bookmarkNote: (noteId: string) => dispatch(bookmarkNote(noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteOptions)
