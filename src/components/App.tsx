import React, { useEffect } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import Navigation from 'containers/Navigation'
import AppSideBar from 'containers/AppSidebar'
import { loadNotes, loadCategories } from 'actions'

interface AppProps {
  loadNotes: Function
  loadCategories: Function
}

const App: React.FC<AppProps> = ({ loadNotes, loadCategories }) => {
  useEffect(() => {
    loadNotes()
  }, [loadNotes])
  return (
    <div className="app">
      <AppSideBar />
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadNotes: () => dispatch(loadNotes()),
  loadCategories: () => dispatch(loadCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
