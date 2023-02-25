import React from 'react'
import "./nav.css";
import {AiOutlineFileAdd, AiOutlineDelete, AiOutlineHome} from "react-icons/ai"
import { useState } from 'react';
import { BiArchive} from 'react-icons/bi';
import { Outlet, Link } from 'react-router-dom';

const Nav = () => {
//   const [activeNav, setActiveNav] = useState("/");
  let activeNav;
  if (window.location.pathname === "/") {
    activeNav = "/";
  } else if (window.location.pathname === "/create-note") {
    activeNav = "create-note";
  } else if (window.location.pathname === "/archived") {
    activeNav = "archived";
  } else if (window.location.pathname === "/deletedNotes") {
    activeNav = "deleted";
   }
  
  // return (
  //    <nav>

  //      <a href="/" className={activeNav === "/" ? "active" : ""} ><AiOutlineHome /></a>
      
  //     <a href="/create-note" className={activeNav === "create-note" ? "active" : ""}><AiOutlineFileAdd /></a>
  //     <a href="/archived" className={activeNav === "archived" ? "active" : ""}><BiArchive /></a>
  //     <a href="/deletedNotes" className={activeNav === "deleted" ? "active" : ""}><AiOutlineDelete /></a>

  //   </nav> 
  // )
  return (
    <>
    <nav>

      <Link to="/" className={activeNav === "/" ? "active" : ""}>
        <AiOutlineHome /> 
       </Link>
      <Link to='/create-note' className={activeNav === "create-note" ? "active" : ""}>
        <AiOutlineFileAdd /> 
      </Link> 
      <Link to='/archived' className={activeNav === "archived" ? "active" : ""}>
        <BiArchive /> 
      </Link> 
      <Link to='/deletedNotes' className={activeNav === "deleted" ? "active" : ""}>
        <AiOutlineDelete /> 
      </Link>  

   </nav> 
   {/* <Outlet /> */}
   </>
 )
    
}

export default Nav;