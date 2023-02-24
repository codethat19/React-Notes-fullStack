import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import CreateNote from './pages/CreateNote';
import EditNote from "./pages/EditNote";
// import dummyNotes from './dummy_notes';
import Nav from "./components/nav/Nav"
import DeletedNotes from "./components/DeletedNotes";
import ArchivedNotes from "./components/ArchivedNotes";
import api from "./components/axios";

import { useState } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]);
  // const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || []);
  // console.log(notes);
  const viewNotes = async () => {
    // console.log("View notes called")
    // const flag = JSON.stringify( setFlag );
    //console.log();
    //setNoteFlag();
    await api.get('/')
    .then(res => {
      setNotes(res.data);
      return res.data;
      // console.log(res.data);
    })
    .catch( error => {
      console.log(error);
    });
  };
  useEffect( () => {
    viewNotes();
    // console.log(notes);
  }, []);
  // useEffect(() => {
  //   localStorage.setItem('notes', JSON.stringify(notes))
  // }, [notes]);
  // console.log(notes);
  
  if (!notes.length && window.location.pathname !== "/create-note") {
    let activeNav;
    if (window.location.pathname === "/") {
      activeNav = "My Notes";
    } else if (window.location.pathname === "/archived") {
      activeNav = "Archived Notes";
    } else if (window.location.pathname === "/deletedNotes") {
      activeNav = "Deleted Notes";
   }
    return (
      <main id="app">
        <header className="notes__header">
          <h2>{activeNav}</h2>
        </header>
        <p className='empty__notes'>No {activeNav.substring(0, activeNav.indexOf(' '))} notes found</p>
        <Nav />
      </main>
    );
  }
  return (
    <main id="app">
      <BrowserRouter>
        <Routes>
            <Route path="/"  element={<><Nav /><Notes notes={notes} setNotes={setNotes}/></>}/>
            <Route path="/create-note"  element={<><Nav /><CreateNote viewNotes={viewNotes} setNotes={setNotes}/></>}/>
            <Route path="/edit-note/:id"  element={<><Nav /><EditNote notes={notes} viewNotes={viewNotes} setNotes={setNotes}/></>}/>
            <Route path="/deletedNotes" element={<><Nav /><DeletedNotes notes={notes} setNotes={setNotes}/></>} />
            <Route path="/archived" element={<><Nav /><ArchivedNotes notes={notes} setNotes={setNotes}/></>} />
            <Route path="*"  element={<><Nav /><Notes notes={notes} setNotes={setNotes}/></>}/>
        </Routes>
      </BrowserRouter>
    </main>
    
  )
}

export default App;