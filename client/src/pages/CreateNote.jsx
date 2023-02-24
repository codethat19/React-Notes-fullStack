import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {IoIosArrowBack} from 'react-icons/io';
import {v4 as uuid} from 'uuid';
import useCreateDate from '../components/useCreateDate';
import api from "./../components/axios";

const CreateNote = ({setNotes, viewNotes}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const date = useCreateDate();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(title && details) {
      const colorId = Math.floor(Math.random() * 10);
      const note = { title, details, colorId };

      // const newNote = JSON.stringify( note );
        await api.post('/create-note', note)
        .then(response => {
          setNotes(viewNotes());
          navigate('/');
        })
        .catch( error => {
          console.log(error);
        });
    } else {
      navigate('/');
    }
  }


  return (
    <section>
      <header className="create-note__header">
        <Link to="/" className='btn'><IoIosArrowBack /></Link>
        <button className="btn lg primary" onClick={handleSubmit}>Save</button>
      </header>

      <form onSubmit={handleSubmit} className="create-note__form">
        <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}autoFocus />
        <textarea rows="28" placeholder='Note details....' value={details} onChange={(e) => setDetails(e.target.value)}></textarea>
      </form>
    </section>
  )
}

export default CreateNote