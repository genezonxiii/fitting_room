import React, { Component } from "react";

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {
				mobile: ''
			}
		}
		this.onChangeMobile = this.onChangeMobile.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	onChangeMobile (e) {
		this.setState({ user: { ...this.state.user, mobile: e.target.value} });
	}

	confirm() {
		console.log(this.state.user);
	}

	render() {
		const { user } = this.state;

		return (
			<div>
				<h2>登入</h2>
				<div>
					<label>
						手機
						<input
							type="text"
							placeholder="手機號碼"
							onChange={this.onChangeMobile}
							value={user.mobile}
						/>
					</label>
				</div>
				<button onClick={this.confirm}>
					登入
				</button>
			</div>
		)
	}
}

export default Login;