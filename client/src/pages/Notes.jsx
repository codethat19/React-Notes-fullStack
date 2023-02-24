import React, { useEffect, useState } from 'react';
import {CiSearch} from 'react-icons/ci';
import {BsPlusLg} from 'react-icons/bs';
import dummyNotes from '../dummy_notes'
import { Link } from 'react-router-dom';
import NoteItem from '../components/NoteItem';
import {GrClose} from 'react-icons/gr';
import {AiFillPlusCircle} from 'react-icons/ai';
import api from "./../components/axios";

const Notes = ({notes, setNotes}) => {

    // async function viewNotes () {
    //     await api.get('/view')
    //     .then(res => {
    //       // console.log(res.data);
    //       setNotes(res.data);
    //     })
    //     .catch( error => {
    //       console.log(error);
    //     });
    // }

    // useEffect( () => {
    //     viewNotes();
    // },[]);

//   console.log(notes.length);
  const [showSearch, setShowSearch] = useState(false);
  const [text, setText] = useState(''); 
  const [filteredNotes, setFilteredNotes] = useState(notes);

  const handleSearch = () => {
    setFilteredNotes(notes.filter(note => {
        if (note.title.toLowerCase().match(text.toLocaleLowerCase())) {
            return note;
        }
    }))
  }
  useEffect(handleSearch, [text]);

  return (
    <section>
        <header className="notes__header">
            {!showSearch && <h2>My Notes</h2>}
            {showSearch && <input type="text" value={text} onChange={(e) => {
                setText(e.target.value);
                handleSearch();
                }} 
                autoFocus placeholder="Keyword..." />}
            <button className='btn' onClick={() =>setShowSearch(prevState => !prevState)}>{showSearch ? <GrClose onClick={ () => setText('')}/> : <CiSearch />}</button>
        </header>
        <div className="notes__container">
            {filteredNotes.length === 0 && <p className='empty__notes'>No Notes found</p>}
            {
                filteredNotes.map((note, index) => 
                
                <NoteItem 
                    key={index}
                    note={note}
                    colorId={note.colorId}
                />
                )
            }
        </div>
        {/* <Link to="/create-note" className='btn add__btn'>
            <BsPlusLg />
        </Link> */}
    </section>
  )
}

export default Notes