import React from "react";
import { Link } from "react-router-dom";

function UserInfo(props) {
  return (
    <div className="user-info-bar">
      <i className="mdi mdi-account-circle"></i>
      {
        props.user && props.user.mobile? <span className="user-phone">{props.user.mobile}</span>:null
      }
      {
        props.user && props.user.nick_name? <span className="user-name">{props.user.nick_name}</span>:null
      }
      <Link 
      	onClick={props.handleLogout}
      	to="login" 
      	className="btn-logout"
      >
      	<i className="mdi mdi-power"></i>
      </Link>
    </div>
  )
}

export default UserInfo;