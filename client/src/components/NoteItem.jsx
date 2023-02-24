import React from 'react'
import { Link } from 'react-router-dom'
import {HiOutlineClock} from 'react-icons/hi'

const NoteItem = ({note, colorId}) => {

  const colorArray = ["#00425A", "#1F8A70", "#BFDB38", "#FC7300", "#FCE22A", "#30E3DF",
"#D61355", "#F94A29", "#FCE22A", "#30E3DF"];
  // console.log(colorId);

  const backgroundColour = {
    backgroundColor: colorArray[colorId]
  }

  return (
    <Link to={`/edit-note/${note._id}`} style={backgroundColour}className="note">
        <h3>{note.title.length > 70 ? (note.title.substr(0, 70)) + "..." : note.title}</h3>
        <h5>{note.details.length > 120 ? (note.details.substr(0, 120)) + "..." : note.details}</h5>
        <p><HiOutlineClock className='clock'/>{note.updatedAt.substr(0, 10)}</p>
    </Link>
  )
}

export default NoteItem