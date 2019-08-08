import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <ul>
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
    </ul>
  );
}

export default Header;