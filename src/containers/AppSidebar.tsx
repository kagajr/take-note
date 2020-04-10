import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { CategoryItem, ApplicationState, NoteItem } from 'types'
import {
  addCategory,
  swapCategory,
  swapFolder,
  swapNote,
  pruneCategoryFromNotes,
  deleteCategory,
} from 'actions'
import kebabCase from 'lodash/kebabCase'
import { Folders } from 'constants/enums'

interface AppProps {
  addCategory: (category: CategoryItem) => void
  swapCategory: (categoryId: string) => void
  categories: CategoryItem[]
  activeCategoryId: string
  swapNote: (swapNote: string) => void
  notes: NoteItem[]
  deleteCategory: (categoryId: string) => void
  pruneCategoryFromNotes: (categoryId: string) => void
  swapFolder: (folder: string) => void
}

const AppSidebar: React.FC<AppProps> = ({
  addCategory,
  deleteCategory,
  pruneCategoryFromNotes,
  categories,
  swapCategory,
  activeCategoryId,
  swapNote,
  swapFolder,
  notes,
}) => {
  const [addingTempCategory, setAddingTempCategory] = useState(false)
  const [tempCategory, setTempCategory] = useState('')

  const newTempCategoryHandler = () => {
    !addingTempCategory && setAddingTempCategory(true)
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

  return (
    <aside className="app-sidebar">
      <section id="app-sidebar-main">
        <div
          className="app-sidebar-link"
          onClick={() => {
            swapFolder(Folders.ALL)
          }}
        >
          Notes
        </div>
        <div
          className="app-sidebar-link"
          onClick={() => {
            swapFolder(Folders.TRASH)
          }}
        >
          Trash
        </div>
        <div className="category-list vbetween">
          <h2>Categories</h2>
          <button className="add-button" onClick={newTempCategoryHandler}>
            +
          </button>
        </div>
        <div className="category-list">
          {categories.map((category) => {
            return (
              <div
                className={
                  category.id === activeCategoryId ? 'category-each active' : 'category-each'
                }
                key={category.id}
                onClick={() => {
                  const notesForNewCategory = notes.filter((note) => note.category === category.id)
                  const newNoteId = notesForNewCategory.length > 0 ? notesForNewCategory[0].id : ''
                  if (category.id !== activeCategoryId) {
                    swapCategory(category.id)
                    swapNote(newNoteId)
                  }
                }}
              >
                <div>{category.name}</div>
                <div
                  className="category-options"
                  onClick={() => {
                    const newNoteId = notes.length > 0 ? notes[0].id : ''
                    deleteCategory(category.id)
                    pruneCategoryFromNotes(category.id)
                    swapCategory('')
                    swapFolder(Folders.ALL)
                    swapNote(newNoteId)
                  }}
                >
                  X
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
    </aside>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  activeCategoryId: state.noteState.activeCategoryId,
  categories: state.categoryState.categories,
  notes: state.noteState.notes,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapNote: (noteId: string) => dispatch(swapNote(noteId)),
  swapFolder: (folder: string) => dispatch(swapFolder(folder)),
  swapCategory: (categoryId: string) => dispatch(swapCategory(categoryId)),
  addCategory: (category: CategoryItem) => dispatch(addCategory(category)),
  deleteCategory: (categoryId: string) => dispatch(deleteCategory(categoryId)),
  pruneCategoryFromNotes: (categoryId: string) => dispatch(pruneCategoryFromNotes(categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)
