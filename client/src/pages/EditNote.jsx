import {React, useState} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import {RiDeleteBin6Line} from 'react-icons/ri';
import useCreateDate from '../components/useCreateDate';


const EditNote = ({notes, setNotes}) => {

  const {id} = useParams();
  console.log(id);

  const note = notes.find((item) => item._id === id);
  // console.log(note);
  const [title, setTitle] = useState(note.title);
  const [details, setDetails] = useState(note.details);
  const navigate = useNavigate();
  const date = useCreateDate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (title && details) {
    //   note.title = title;
    //   note.details = details;
    //   note.date = date;

    //   navigate('/');
    // }
    //Code from video
    // if (title && details) {
      const newNote = {...note, title, details};

      const newNotes = notes.map(item => {
        if (item._id === id) {
          item = newNote;
        }
        return item;
      })
      setNotes(newNotes);
      navigate('/');
    }
  
  const handleDelete = () => {
    const newNotes = notes.filter(item => item.id !== id);
    setNotes(newNotes);
    navigate('/');
  }

  return (
    <section>
      <header className="create-note__header">
        <Link to="/" className='btn'><IoIosArrowBack /></Link>
        <button onClick={handleSubmit} className="btn lg primary">Save</button>
        <button onClick={handleDelete} className="btn danger"><RiDeleteBin6Line /></button>
      </header>

      <form className="create-note__form">
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <textarea rows="28" placeholder='Note details....' value={details} onChange={e => setDetails(e.target.value)}></textarea>
      </form>
    </section>
  )
}

export default EditNote