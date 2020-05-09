import React, { useEffect } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import AppSideBar from 'containers/AppSidebar'
import KeyboardShortcuts from 'containers/KeyboardShortcuts'
import { loadNotes, loadCategories } from 'actions'
import { KeyboardProvider } from '../contexts/KeyboardContext'

interface AppProps {
  loadNotes: () => void
  loadCategories: () => void
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories }) => {
  useEffect(() => {
    loadNotes()
  }, [loadNotes])
  return (
    <div className="app">
      <KeyboardProvider>
        <AppSideBar />
        <NoteList />
        <NoteEditor />
        <KeyboardShortcuts />
      </KeyboardProvider>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadNotes: () => dispatch(loadNotes()),
  loadCategories: () => dispatch(loadCategories()),
})

export default connect(null, mapDispatchToProps)(App)
