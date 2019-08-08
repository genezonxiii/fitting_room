import React, { Component } from "react";

class Quest extends Component {
	constructor(props) {
		super(props)
		this.state = {
			quest: {
				age: '',
				sex: ''
			}
		}
		this.onChangeAge = this.onChangeAge.bind(this);
		this.onChangeSex = this.onChangeSex.bind(this);
		this.confirm = this.confirm.bind(this);
	}

	onChangeAge (e) {
		this.setState({ quest: { ...this.state.quest, age: e.target.value} })
	}

	onChangeSex (e) {
		this.setState({ quest: { ...this.state.quest, sex: e.target.value} })
	}

	confirm() {
		console.log(this.state.quest);
	}

	render() {
		const { quest } = this.state;
		return (
			<div>
				<h2>填寫資料</h2>
				<div>
					<label>
						年齡
						<input
							type="text"
							placeholder="年齡"
							onChange={this.onChangeAge}
							value={quest.age}
						/>
					</label>
				</div>
				<div>
					<label>
						性別
						<input
							type="text"
							placeholder="性別"
							onChange={this.onChangeSex}
							value={quest.sex}
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

export default Quest;