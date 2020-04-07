import React from 'react'
import NoteList from 'containers/NoteList'
import NoteEditor from 'containers/NoteEditor'
import Navigation from 'containers/Navigation'
import AppSideBar from 'containers/AppSidebar'

const App: React.FC = () => {
  return (
    <div className="app">
      <AppSideBar />
      <NoteList />
      <NoteEditor />
      <Navigation />
    </div>
  )
}

export default App
