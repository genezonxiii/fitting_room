import React, { Component } from "react";

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
			<div>
				<h2>登入</h2>
				<div>
					<label>
						手機
						<input
							type="text"
							placeholder="手機號碼"
							onChange={this.onChangeMobile}
							value={mobile}
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