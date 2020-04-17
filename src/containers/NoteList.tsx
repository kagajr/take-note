import React, { useState, useEffect, useRef } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { swapNote, pruneNotes, swapCategory, addCategoryToNote } from 'actions'
import { NoteItem, CategoryItem, ApplicationState } from 'types'
import { getNoteTitle } from 'helpers'
import { Folders } from 'constants/enums'
import NoteOptions from 'containers/NoteOptions'
import { MoreHorizontal } from 'react-feather'
import { folderMap } from 'constants/index'

interface NoteListProps {
  activeFolder: string
  activeCategory?: CategoryItem
  activeNoteId: string
  activeCategoryId: string
  notes: NoteItem[]
  filteredNotes: NoteItem[]
  filteredCategories: CategoryItem[]
  swapNote: (noteId: string) => void
  swapCategory: (categoryId: string) => void
  pruneNotes: () => void
  addCategoryToNote: (categoryId: string, noteId: string) => void
}

const NoteList: React.FC<NoteListProps> = ({
  activeFolder,
  activeCategoryId,
  activeCategory,
  activeNoteId,
  notes,
  filteredNotes,
  filteredCategories,
  swapNote,
  swapCategory,
  pruneNotes,
  addCategoryToNote,
}) => {
  const [noteOptionsId, setNoteOptionsId] = useState('')
  const node = useRef<HTMLDivElement>(null)

  const handleNoteOptionsClick = (
    event: MouseEvent | React.MouseEvent<HTMLDivElement> | React.ChangeEvent<HTMLSelectElement>,
    noteId: string = ''
  ) => {
    event.stopPropagation()

    if (node.current) {
      if (node.current.contains(event.target as HTMLDivElement)) return
    }

    if (!noteOptionsId) {
      setNoteOptionsId(noteId)
    } else if (noteOptionsId !== noteId) {
      setNoteOptionsId(noteId)
    } else {
      setNoteOptionsId('')
    }
  }

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleNoteOptionsClick)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleNoteOptionsClick)
    }
  })

  return (
    <aside className="note-sidebar">
      <div className="note-sidebar-header">
        {activeFolder === 'CATEGORY' ? activeCategory!.name : folderMap[activeFolder]}
      </div>
      <div className="note-list">
        {filteredNotes.map((note) => {
          const noteTitle = getNoteTitle(note.text)
          return (
            <div
              className={note.id === activeNoteId ? 'note-each active' : 'note-each'}
              key={note.id}
              onClick={() => {
                if (note.id !== activeNoteId) {
                  swapNote(note.id)
                  pruneNotes()
                }
              }}
            >
              <div>{noteTitle}</div>
              <div
                className={noteOptionsId === note.id ? 'note-options active ' : 'note-options'}
                onClick={(event) => handleNoteOptionsClick(event, note.id)}
              >
                <MoreHorizontal size={15} />
              </div>
              {noteOptionsId === note.id && (
                <div
                  ref={node}
                  className="note-options-context"
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  <h2>Move to category</h2>
                  <select
                    className="select-element"
                    defaultValue=""
                    onChange={(event) => {
                      addCategoryToNote(event.target.value, note.id)
                      const notesForNewCategory = notes.filter(
                        (note) => note.category === event.target.value
                      )
                      const newNoteId =
                        notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                      if (event.target.value !== activeCategoryId) {
                        swapCategory(event.target.value)
                        swapNote(note.id)
                      }

                      setNoteOptionsId('')
                    }}
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    {filteredCategories
                      .filter((category) => category.id !== note.category)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    {note.category && (
                      <option key="note" value="">
                        Remove category
                      </option>
                    )}
                  </select>
                  <NoteOptions clickedNote={note} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

const mapStateToProps = (state: ApplicationState) => {
  const { noteState, categoryState } = state

  let filteredNotes: NoteItem[]

  if (noteState.activeFolder === Folders.CATEGORY) {
    filteredNotes = noteState.notes.filter(
      (note) => !note.trash && note.category === noteState.activeCategoryId
    )
  } else if (noteState.activeFolder === Folders.FAVORITES) {
    filteredNotes = noteState.notes.filter((note) => !note.trash && note.bookmark)
  } else if (noteState.activeFolder === Folders.TRASH) {
    filteredNotes = noteState.notes.filter((note) => note.trash)
  } else {
    filteredNotes = noteState.notes.filter((note) => !note.trash)
  }

  filteredNotes.sort(function (a, b) {
    let dateA = new Date(a.lastUpdated)
    let dateB = new Date(b.lastUpdated)
    return dateB > dateA ? 1 : dateB === dateA ? 0 : 1
  })

  return {
    activeFolder: noteState.activeFolder,
    activeCategoryId: noteState.activeCategoryId,
    activeCategory: categoryState.categories.find(
      (category) => category.id === noteState.activeCategoryId
    ),
    activeNoteId: noteState.activeNoteId,
    notes: noteState.notes,
    filteredNotes,
    filteredCategories: categoryState.categories.filter(
      (category) => category.id !== noteState.activeCategoryId
    ),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  pruneNotes: () => dispatch(pruneNotes()),
  swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
  addCategoryToNote: (categoryId: string, noteId: string) =>
    dispatch(addCategoryToNote(categoryId, noteId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoteList)
