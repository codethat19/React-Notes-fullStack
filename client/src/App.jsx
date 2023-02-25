import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Notes from './pages/Notes';
import CreateNote from './pages/CreateNote';
import EditNote from "./pages/EditNote";
// import dummyNotes from './dummy_notes';
import Nav from "./components/nav/Nav"
import DeletedNotes from "./components/DeletedNotes";
import ArchivedNotes from "./components/ArchivedNotes";
import api from "./components/axios";
import {AiOutlineFileAdd, AiOutlineDelete, AiOutlineHome} from "react-icons/ai"
import { BiArchive} from 'react-icons/bi';
import { useState } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [first, setFirst] = useState(1);
  // const navigate = useNavigate();
  
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
      // navigate('/');
      //return res.data;
      // console.log(res.data);
      // notes= res.data;
    })
    .catch( error => {
      console.log(error);
    });
  };
  // const viewNotes = () => {
  //   api.get('/')
  //   .then(res => setNotes(res.data))
  //   .catch(err => console.log(err))
  // }
  // viewNotes();

    useEffect( () => {
      if (first) viewNotes();
      setFirst(0);
      // console.log(notes);
    }, []);

  

  //NAV Component




  //NAV end
  
  // useEffect(() => {
  //   localStorage.setItem('notes', JSON.stringify(notes))
  // }, [notes]);
  // console.log("App called");
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
        {/* <Nav /> */}
        
      </main>
    );
  }
  return (
    <main id="app">
      <BrowserRouter>
      <Nav />
        <Routes>
        
            <Route path="/"  element={<><Notes notes={notes} viewNotes={viewNotes} setNotes={setNotes}/></>}/>
            <Route path="/create-note"  element={<><CreateNote viewNotes={viewNotes} setNotes={setNotes}/></>}/>
            <Route path="/edit-note/:id"  element={<><EditNote notes={notes} viewNotes={viewNotes} setNotes={setNotes}/></>}/>
            <Route path="/deletedNotes" element={<><DeletedNotes notes={notes} setNotes={setNotes}/></>} />
            <Route path="/archived" element={<><ArchivedNotes notes={notes} setNotes={setNotes}/></>} />
            {/* <Route path="*"  element={<><Notes notes={notes} setNotes={setNotes}/></>}/> */}
        </Routes>
      </BrowserRouter>
    </main>
    
  )
}

export default App;