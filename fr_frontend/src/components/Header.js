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
      <li>
        <Link to="/login">登入</Link>
      </li>
      <li>
        <Link to="/register">新申請</Link>
      </li>
      <li>
        <Link to="/style">風格挑選</Link>
      </li>
      <li>
        <Link to="/tryOn">我的試衣間</Link>
      </li>
      <li>
        <Link to="/Order">我要試穿</Link>
      </li>
    </ul>
  );
}

export default Header;