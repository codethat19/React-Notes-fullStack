import {React, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import {RiDeleteBin6Line, RiInboxArchiveLine, RiInboxUnarchiveFill} from 'react-icons/ri';
import useCreateDate from '../components/useCreateDate';
import api from "./../components/axios";
import {FaTrashRestoreAlt} from 'react-icons/fa';

const EditNote = ({notes, setNotes, viewNotes}) => {

  const {id} = useParams();
  console.log(id);

  const note = notes.find((item) => item._id === id);
  console.log(note.flag);
  let ArchiveButton = <></>;
  let DeleteButton = <></>;
  let RecoverDeleteButton = <></>;

  if (note.flag === 1 || note.flag === 0) {
    ArchiveButton = <button onClick={handleArchive} className="btn"><RiInboxArchiveLine /></button>
  } else if (note.flag === 2) {
    ArchiveButton = <button onClick={handleUnArchive} className="btn"><RiInboxUnarchiveFill /></button>;
  }

  if (note.flag === 1 || note.flag === 2) {
    DeleteButton = <button onClick={handleDelete} className="btn"><RiDeleteBin6Line /></button>
  } else if (note.flag === 0) {
    RecoverDeleteButton = <button onClick={handleRecover} className="btn"><FaTrashRestoreAlt /></button>;
    DeleteButton = <button onClick={handlePermaDelete} className="btn danger"><RiDeleteBin6Line /></button>;
  }

  const [title, setTitle] = useState(note.title);
  const [details, setDetails] = useState(note.details);
  const navigate = useNavigate();
  const date = useCreateDate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // if (title && details) {
  //   //   note.title = title;
  //   //   note.details = details;
  //   //   note.date = date;

  //   //   navigate('/');
  //   // }
  //   //Code from video
  //   // if (title && details) {
  //     const newNote = {...note, title, details};

  //     const newNotes = notes.map(item => {
  //       if (item._id === id) {
  //         item = newNote;
  //       }
  //       return item;
  //     })
  //     setNotes(newNotes);
  //     navigate('/');
  //   }
  const handleSubmit = (e) => {
    e.preventDefault();

    if (title && details) {
      const newNote = {
        title: title,
        details: details
      }
      api.post('/update/', {newNote}, {params: {id: id}})
      .then(response => {      
        setNotes(viewNotes());
        navigate('/');
      })
      .catch(error => {
        console.log(error);
      })
    } 
    navigate('/');
  }
  // const handleDelete = () => {
  //   const newNotes = notes.filter(item => item.id !== id);
  //   setNotes(newNotes);
  //   navigate('/');
  // }
  async function handleDelete() {
    await api.post('/deleteNote/', null, {params: {id: id}})
      .then(response => {
        setNotes(viewNotes());
        navigate('/');
      })
      .catch( error => {
        console.log(error);
      });
  }
  async function handlePermaDelete() {
    await api.post('/permaDeleteNote/', null, {params: {id: id}})
      .then(response => {
        setNotes(viewNotes());
        navigate('/');
      })
      .catch( error => {
        console.log(error);
      });
  }
  async function handleUnArchive() {
    await api.post('/unarchive/', null, {params: {id: id}})
      .then(response => {
        setNotes(viewNotes());
        navigate('/');
      })
      .catch( error => {
        console.log(error);
      });
  }
  async function handleArchive() {
    await api.post('/archive/', null, {params: {id: id}})
      .then(response => {
        setNotes(viewNotes());
        navigate('/');
      })
      .catch( error => {
        console.log(error);
      });
  }
  async function handleRecover() {
    await api.post('/unarchive/', null, {params: {id: id}})
      .then(response => {
        setNotes(viewNotes());
        navigate('/');
      })
      .catch( error => {
        console.log(error);
      });
  }

  return (
    <section>
      <header className="create-note__header">
        <Link to="/" className='btn'><IoIosArrowBack /></Link>
        <button onClick={handleSubmit} className="btn lg primary">Save</button>
        {/* {(note.flag === 1) ? <button onClick={handleArchive} className="btn"><RiInboxArchiveLine /></button> : <button onClick={handleUnArchive} className="btn"><RiInboxUnarchiveFill /></button>} */}
        {ArchiveButton}
        {RecoverDeleteButton}
        {DeleteButton}
        {/* <button onClick={handleDelete} className="btn danger"><RiDeleteBin6Line /></button> */}
      </header>

      <form className="create-note__form">
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <textarea rows="28" placeholder='Note details....' value={details} onChange={e => setDetails(e.target.value)}></textarea>
      </form>
    </section>
  )
}

export default EditNote