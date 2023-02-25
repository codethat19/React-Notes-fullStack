import {React, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import {RiDeleteBin6Line, RiInboxArchiveLine, RiInboxUnarchiveFill} from 'react-icons/ri';
// import useCreateDate from '../components/useCreateDate';
import api from "./../components/axios";
import {FaTrashRestoreAlt} from 'react-icons/fa';

const EditNote = ({notes, setNotes, viewNotes}) => {

  //Extracting id from parameter and finding the matching note
  const {id} = useParams();
  const note = notes.find((item) => item._id === id);

  //Rendering ArchiveButton, DeleteButton and RecoverDeleteButton depending on the page we are in
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

  //Using useState to manage Note's fields
  const [title, setTitle] = useState(note.title);
  const [details, setDetails] = useState(note.details);
  const navigate = useNavigate();

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
        
      })
      .catch(error => {
        console.log(error);
      })
    } 
    navigate('/');
  }

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
        {ArchiveButton}
        {RecoverDeleteButton}
        {DeleteButton}
      </header>

      <form className="create-note__form">
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <textarea rows="28" placeholder='Note details....' value={details} onChange={e => setDetails(e.target.value)}></textarea>
      </form>
    </section>
  )
}

export default EditNote