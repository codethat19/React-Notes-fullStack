import React, {useEffect} from 'react';
import api from './axios';
import NoteItem from './NoteItem';

const DeletedNotes = (props) => {

  async function viewDeletedNotes () {
    await api.get('/deletedNotes')
      .then(res => {
        props.setNotes(res.data);
      })
      .catch( error => {
        console.log(error);
      });
  }

  useEffect( () => {
    viewDeletedNotes();
  },[]);

  // console.log(props.notes);
  return (
    <>
    <header className="notes__header">
      <h2>Deleted Notes</h2>
    </header>

    <div className="notes__container">
    {props.notes.map((noteItem, index) => {
      return (
        <NoteItem
          key={index} 
          id={noteItem._id}
          note={noteItem}
          colorId={noteItem.colorId}
          flag={noteItem.flag}
      />
      )
    })}
    </div>    
    </>   
  )
}

export default DeletedNotes;