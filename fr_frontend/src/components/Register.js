import React, { Component } from "react";

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

	confirm() {
		console.log(this.state.user);
	}

	render() {
		const { user } = this.state;
		return (
			<div>
				<h2>新申請</h2>
				<div>
					<label>
						手機號碼
						<input
							type="text"
							placeholder="手機號碼"
							onChange={this.onChangeMobile}
							value={user.mobile}
						/>
					</label>
				</div>
				<div>
					<label>
						暱稱
						<input
							type="text"
							placeholder="暱稱"
							onChange={this.onChangeNickName}
							value={user.nick_name}
						/>
					</label>
				</div>
				<div>
					<label>
						電子信箱
						<input
							type="text"
							placeholder="電子信箱"
							onChange={this.onChangeEmail}
							value={user.email}
						/>
					</label>
				</div>
				<button onClick={this.confirm}>
					確認
				</button>
			</div>
		)
	}
}

export default Register;