import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <ul>
      <div>
        {props.user && props.user.id?`${props.user.nick_name} 您好!!`:null}
      </div>
      <li>
        <Link to="/">首頁</Link>
      </li>
      {
        !props.isLogin?
          <li>
            <Link to="/login">登入</Link>
          </li>
          :null
      }
      {
        !props.isLogin?
          <li>
            <Link to="/register">新申請</Link>
          </li>
          :null
      }
      {
        props.isLogin?
        <span onClick={props.handleLogout}>
            登出<i className="fa fa-sign-out" />
        </span>
        :null
      }
    </ul>
  );
}

export default Header;