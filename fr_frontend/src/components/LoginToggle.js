import React from "react";
import { Link } from "react-router-dom";

function LoginToggle(props) {
	return (
    <ul className="login-toggle">
      <li>
      	<Link
      		to="login"
      		className="toggle-signin"
      	>
	      	<i className="mdi mdi-lock-open"></i>
	      	<span>登入</span>
      	</Link>
    	</li>
      <li>
      	<Link
      		to="register"
      		className="toggle-register"
      	>
      		<i className="mdi mdi-account-plus"></i>
      		<span>新帳戶</span>
    		</Link>
      </li>
    </ul>

	)
}

export default LoginToggle;
