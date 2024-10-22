import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Chatbot from "./Chatbot";
import * as CONSTANT from './constant';

const axios = require('axios');

class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isRegister: false,
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

		this.renderRedirect = this.renderRedirect.bind(this);
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
			isRegister: true,
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
    	errorMsg.push(CONSTANT.REQUIRED_MOBILE)
    }
    if (user.nick_name == '') {
    	errorMsg.push(CONSTANT.REQUIRED_NICKNAME)
    }
    if (user.email == '') {
    	errorMsg.push(CONSTANT.REQUIRED_EMAIL)
    }

    errorMsg.length > 0? alert(errorMsg.join("\r\n")):this.valid()
  }

	valid() {
		const { user } = this.state;
		let errorMsg = []

		if(!this.validateMobile(user.mobile)) {
			errorMsg.push(CONSTANT.ERROR_MSG_MOBILE)
		}
		if(!this.validateEmail(user.email)) {
			errorMsg.push(CONSTANT.ERROR_MSG_EMAIL)
		}

    errorMsg.length > 0? alert(errorMsg.join("\r\n")):this.confirm()
	}

	confirm() {
		var self = this; 

    axios.post(`${CONSTANT.WS_URL}/api/user`, this.state.user)
      .then(function(response) {
        // handle success
        if (response.data.success) {
        	alert(`${self.state.user.nick_name} 您好, 註冊成功!請重新登入!`);
        } else {
        	alert('註冊失敗，這個手機號碼已有人使用!');
        }

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

	renderRedirect() {
		return (
			<Redirect exact from="/register" to="/login" />
		)
	}

	render() {
		const { user } = this.state;
		return (
			<div className="login-body">
				{ this.state.isRegister? this.renderRedirect():null }
				<h1 className="sys-title">虛擬試衣間</h1>

				<div className="login-panel-wrap">

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

						<Link 
							to="login"
							className="login-toggle toggle-signin"
						>
							<i className="mdi mdi-lock-open"></i>
							<span>既有帳號登入</span>
						</Link>
					</div>

				</div>
        <Chatbot/>
			</div>
		)
	}
}

export default Register;