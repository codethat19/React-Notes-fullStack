import React, { useEffect, useState } from 'react';
import {CiSearch} from 'react-icons/ci';
import {BsPlusLg} from 'react-icons/bs';
import dummyNotes from '../dummy_notes'
import { Link, useNavigate } from 'react-router-dom';
import NoteItem from '../components/NoteItem';
import {GrClose} from 'react-icons/gr';
import {AiFillPlusCircle} from 'react-icons/ai';
import api from "./../components/axios";

const Notes = (props) => {

    const navigate = useNavigate();
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
    const [filteredNotes, setFilteredNotes] = useState(props.notes);
    async function getNotes () {

        await api.get('/')
        .then(res => {
            props.setNotes(res.data);
            setFilteredNotes(res.data);
            return res.data;
        })
        .catch( error => {
          console.log(error);
        });
      };
    useEffect( () => {
        getNotes();
        // setFilteredNotes(props.notes);
        // setFilteredNotes(getNotes());
        // navigate('/');
    }, []);
    

    // if (!notes.length) {
    //     let fetchedNotes = viewNotes();
    //     setNotes(fetchedNotes);
    // }


//   console.log(props.notes);
  const [showSearch, setShowSearch] = useState(false);
  const [text, setText] = useState(''); 
  
//   console.log("Filtered")
//   console.log(filteredNotes);
  const handleSearch = () => {
    setFilteredNotes(props.notes.filter(note => {
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
                    flag={note.flag}
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