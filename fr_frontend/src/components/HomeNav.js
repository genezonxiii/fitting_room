import React from "react";
import { Link } from "react-router-dom";

function HomeNav(props) {
  return (
    <div className="home-navbar">
      <Link 
      	onClick={props.handleHome}
      	to="style" 
      	className="go-home"
      >
      </Link>
      <h2 className="page-title">{props.title}</h2>
    </div>
  )
}

export default HomeNav;