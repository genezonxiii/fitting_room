import React, { Component } from "react";
import LoginToggle from "./LoginToggle";
import * as constants from './constant';

const axios = require('axios');

class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {
				mobile: '',
				nick_name: '',
				email: ''
			}
		}
		this.onChangeMobile = this.onChangeMobile.bind(this);
		this.onChangeNickName = this.onChangeNickName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);

		this.required = this.required.bind(this);
		this.valid = this.valid.bind(this);
		this.resetUser = this.resetUser.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	onChangeMobile (e) {
		this.setState({ user: { ...this.state.user, mobile: e.target.value} })
	}

	onChangeNickName (e) {
		this.setState({ user: { ...this.state.user, nick_name: e.target.value} })
	}

	onChangeEmail (e) {
		this.setState({ user: { ...this.state.user, email: e.target.value} })
	}

	resetUser() {
		this.setState({
			user: {
				mobile: '',
				nick_name: '',
				email: ''
			}
		})
	}

	validateMobile (text) {
    var re = /^09\d{8}$/
    return re.test(text);
  }

  validateEmail (text) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(text);
  }

  required() {
    const { user } = this.state;
    let errorMsg = [];

    if (user.mobile == '') {
    	errorMsg.push(constants.REQUIRED_MOBILE)
    }
    if (user.nick_name == '') {
    	errorMsg.push(constants.REQUIRED_NICKNAME)
    }
    if (user.email == '') {
    	errorMsg.push(constants.REQUIRED_EMAIL)
    }

    errorMsg.length > 0? alert(errorMsg.join("\r\n")):this.valid()
  }

	valid() {
		const { user } = this.state;
		let errorMsg = []

		if(!this.validateMobile(user.mobile)) {
			errorMsg.push(constants.ERROR_MSG_MOBILE)
		}
		if(!this.validateEmail(user.email)) {
			errorMsg.push(constants.ERROR_MSG_EMAIL)
		}

    errorMsg.length > 0? alert(errorMsg.join("\r\n")):this.confirm()
	}

	confirm() {
		var self = this; 

    axios.post(`http://localhost:3001/api/user`, this.state.user)
      .then(function(response) {
        // handle success
        alert(`${self.state.user.nick_name} 您好, 註冊成功!請重新登入!`);
        self.resetUser();
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
		const { user } = this.state;
		return (
			<div className="login-body">
				<h1 className="sys-title">虛擬試衣間</h1>

				<div className="login-panel-wrap">

					<LoginToggle />

					<div className="login-panel">
						<label htmlFor="userMobile">帳戶申請</label>
						<div className="input-icon-group">
							<i className="mdi mdi-cellphone-iphone"></i>
							<input
								id="userMobile"
								type="text"
								placeholder="手機號碼"
								onChange={this.onChangeMobile}
								value={user.mobile}
							/>
						</div>
						<div className="input-icon-group">
							<i className="mdi mdi-account"></i>
							<input
								type="text"
								placeholder="暱稱"
								onChange={this.onChangeNickName}
								value={user.nick_name}
							/>
						</div>
						<div className="input-icon-group">
							<i className="mdi mdi-email-open"></i>
							<input
								type="text"
								placeholder="電子信箱"
								onChange={this.onChangeEmail}
								value={user.email}
							/>
						</div>
						<a 
							className="btn-login btn-register"
							onClick={this.required}
						>
							註冊
						</a>
					</div>

				</div>
			</div>
		)
	}
}

export default Register;