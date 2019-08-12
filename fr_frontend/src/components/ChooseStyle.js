import React from "react";
import { Link } from "react-router-dom";

function ChooseStyle() {
  return (
    <ul>
      <li>
        <Link to="/selfie">拍照</Link>
      </li>
      <li>
        <Link to="/chooseModel">自行挑選</Link>
      </li>
      <li>
        <Link to="/quest">填寫資料</Link>
      </li>
    </ul>
  );
}

export default ChooseStyle;