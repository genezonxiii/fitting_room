import React, { Component } from "react";
import LoginToggle from "./LoginToggle";

const axios = require('axios');

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mobile: ''
		}
		this.onChangeMobile = this.onChangeMobile.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	onChangeMobile (e) {
		this.setState({ mobile: e.target.value });
	}

	confirm() {
    var self = this; 

    axios.get(`http://localhost:3001/api/user/${this.state.mobile}`)
      .then(function(response) {
        // handle success
        self.props.confirm(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
	}

	render() {
		const { mobile } = this.state;

		return (
			<div className="login-body">
				<h1 className="sys-title">虛擬試衣間</h1>

				<div className="login-panel-wrap">

					<LoginToggle />

					<div className="login-panel">
						<label htmlFor="userLogin">會員登入</label>
						<div className="input-icon-group">
							<i className="mdi mdi-cellphone-iphone"></i>
							<input
								id="userLogin"
								type="text"
								placeholder="請輸入手機號碼"
								onChange={this.onChangeMobile}
								value={mobile}
							/>
						</div>
						<a 
							className="btn-login btn-signin"
							onClick={this.confirm}
						>
							登入
						</a>
					</div>

				</div>
			</div>
		)
	}
}

export default Login;