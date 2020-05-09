import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { CategoryItem, ApplicationState, NoteItem } from 'types'
import uuid from 'uuid/v4'
import moment from 'moment'
import {
  addNote,
  addCategory,
  swapCategory,
  swapFolder,
  swapNote,
  pruneCategoryFromNotes,
  deleteCategory,
  syncState,
} from 'actions'
import { newNote } from 'helpers'
import kebabCase from 'lodash/kebabCase'
import {
  Trash2,
  Book,
  Folder,
  X,
  UploadCloud,
  Plus,
  Settings,
  Upload,
  Bookmark,
} from 'react-feather'
import { Folders } from 'constants/enums'
import { useKeyboard } from '../contexts/KeyboardContext'

const iconColor = 'rgba(255, 255, 255, 0.3)'

interface AppProps {
  addNote: (note: NoteItem) => void
  activeNote?: NoteItem
  addCategory: (category: CategoryItem) => void
  swapCategory: (categoryId: string) => void
  categories: CategoryItem[]
  activeCategoryId: string
  swapNote: (swapNote: string) => void
  notes: NoteItem[]
  deleteCategory: (categoryId: string) => void
  pruneCategoryFromNotes: (categoryId: string) => void
  swapFolder: (folder: string) => void
  activeFolder: string
  syncState: (notes: NoteItem[], categories: CategoryItem[]) => void
}

const AppSidebar: React.FC<AppProps> = ({
  addNote,
  activeNote,
  addCategory,
  deleteCategory,
  pruneCategoryFromNotes,
  categories,
  swapCategory,
  activeCategoryId,
  swapNote,
  swapFolder,
  notes,
  activeFolder,
  syncState,
}) => {
  const { addingTempCategory, setAddingTempCategory } = useKeyboard()
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
  }

  const newNoteHandler = () => {
    if ((activeNote && activeNote.text !== '') || !activeNote) {
      const note = newNote(activeCategoryId, activeFolder)

      addNote(note)
      swapNote(note.id)
    }
  }

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ): void => {
    event.preventDefault()

    const category = { id: kebabCase(tempCategory), name: tempCategory }

    if (!categories.find((cat) => cat.id === kebabCase(tempCategory))) {
      addCategory(category)
      setTempCategory('')
      setAddingTempCategory(false)
    }
  }

  const syncNotesHandler = () => {
    syncState(notes, categories)
  }

  return (
    <aside className="app-sidebar">
      <section id="app-sidebar-main">
        <div
          className={activeFolder === Folders.ALL ? 'app-sidebar-link active' : 'app-sidebar-link'}
          onClick={() => {
            swapFolder(Folders.ALL)
          }}
        >
          <Book size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
          All notes
        </div>
        <div
          className={
            activeFolder === Folders.FAVORITES ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => swapFolder(Folders.FAVORITES)}
        >
          <Bookmark size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
          Favorites
        </div>
        <div
          className={
            activeFolder === Folders.TRASH ? 'app-sidebar-link active' : 'app-sidebar-link'
          }
          onClick={() => {
            swapFolder(Folders.TRASH)
          }}
        >
          <Trash2 size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
          Trash
        </div>
        <div className="category-list vbetween">
          <h2>Categories</h2>
          <button className="add-category-button" onClick={newTempCategoryHandler}>
            <Plus size={15} color={iconColor} />
          </button>
        </div>
        <div className="category-list">
          {categories.map((category) => {
            return (
              <div
                key={category.id}
                className={
                  category.id === activeCategoryId ? 'category-each active' : 'category-each'
                }
                onClick={() => {
                  const notesForNewCategory = notes.filter(
                    (note) => !note.trash && note.category === category.id
                  )
                  const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                  if (category.id !== activeCategoryId) {
                    swapCategory(category.id)
                    swapNote(newNoteId)
                  }
                }}
              >
                <div className="category-each-name">
                  <Folder size={15} style={{ marginRight: '.5rem' }} color={iconColor} />
                  {category.name}
                </div>
                <div
                  className="category-options"
                  onClick={() => {
                    const notesnoteTrash = notes.filter((note) => !note.trash)
                    const newNoteId = notesnoteTrash.length > 0 ? notesnoteTrash[0].id : ''

                    deleteCategory(category.id)
                    pruneCategoryFromNotes(category.id)
                    swapFolder(Folders.ALL)
                    swapNote(newNoteId)
                  }}
                >
                  <X size={12} />
                </div>
              </div>
            )
          })}
        </div>
        {addingTempCategory && (
          <form className="add-category-form" onSubmit={onSubmit}>
            <input
              autoFocus
              placeholder="New category..."
              onChange={(event) => {
                setTempCategory(event.target.value)
              }}
              onBlur={(event) => {
                if (!tempCategory) {
                  setAddingTempCategory(false)
                } else {
                  onSubmit(event)
                }
              }}
            />
          </form>
        )}
      </section>
      <section>
        <div className="app-sidebar-actions" onClick={syncNotesHandler}>
          <Plus className="action-button" size={18} onClick={newNoteHandler} color={iconColor} />
          <UploadCloud
            size={18}
            className="action-button"
            color={iconColor}
            onClick={syncNotesHandler}
          />
          <Settings size={18} className="action-button" color={iconColor} />
        </div>
      </section>
    </aside>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  activeNote: state.noteState.notes.find((note) => note.id === state.noteState.activeNoteId),
  activeFolder: state.noteState.activeFolder,
  activeCategoryId: state.noteState.activeCategoryId,
  categories: state.categoryState.categories,
  notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: (note: NoteItem) => dispatch(addNote(note)),
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  swapFolder: (folder: string) => dispatch(swapFolder(folder)),
  swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
  addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
  deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
  pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
  syncState: (notes: NoteItem[], categories: CategoryItem[]) =>
    dispatch(syncState(notes, categories)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)
