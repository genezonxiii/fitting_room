import React, { Component } from "react";
import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";

const data = [{
	id: 'figureM',
	value: 'M',
	label: '男',
	img: 'man-body-silhouette.png'
}, {
	id: 'figureF',
	value: 'F',
	label: '女',
	img: 'woman-body-silhouette.png'
}, {
	id: 'figureX',
	value: 'X',
	label: '不提供',
	img: 'body-silhouette.png'
}];

class Quest extends Component {
	constructor(props) {
		super(props)
		this.state = {
			figure: 'man-body-silhouette.png',
			quest: {
				age: '',
				sex: 'M'
			}
		}
		this.onChangeAge = this.onChangeAge.bind(this);
		this.onChangeSex = this.onChangeSex.bind(this);
		this.confirm = this.confirm.bind(this);
		this.renderSex = this.renderSex.bind(this);
		this.renderFigure = this.renderFigure.bind(this);
	}

	onChangeAge (e) {
		this.setState({ quest: { ...this.state.quest, age: e.target.value} })
	}

	onChangeSex (e) {
		this.setState({ 
			figure: e.target.getAttribute('data-img'),
			quest: { 
				...this.state.quest, 
				sex: e.target.getAttribute('data-key')
			} 
		})
	}

	confirm() {
		console.log(this.state.quest);
	}

	renderFigure(){
		const { figure } = this.state;
		return (
      <div className="figure-section">
        <div className="figure-fitting-wrap">
          <img 
          	className="fitting-figure" 
          	src={`images/${figure}`} 
          	alt={figure} 
          />
        </div>
      </div>
		)
	}

	renderSex() {
		return (
			<div className="form-row">
        <div className="form-label">性別</div>
      	{
      		data.map(el=>{
      			return (
      				<div className="form-value" key={`form-${el.id}`}>
			          <input 
			          	type="radio" 
			          	id={el.id} 
			          	name={el.id} 
			          	data-key={el.value} 
			          	data-img={el.img}
			        		onClick={this.onChangeSex}
			        		checked={this.state.quest.sex===el.value}
			      		/> 
			          <label htmlFor={el.id} >
			          	{el.label}
		          	</label>
		          </div>
      			)
      		})
      	}
      </div>
		)
	}

	render() {
		const { quest } = this.state;
		return (
			<div className="page-body">

				<div className="bkg-circle-blue bkg-circle-big"></div>
      	<div className="bkg-circle-blue bkg-circle-small"></div>

      	<UserInfo 
      		user={this.props.user}
      		handleLogout={this.props.handleLogout}
    		/>

      	<HomeNav title="填寫資料" handleHome={this.props.handleHome} />

      	<div className="fittingroom-wrap">

      		{ this.renderFigure() }

	      	<div className="fill-form-section">
	      		<form>
	            <div className="form-row">
	              <div className="form-label">
	                <label htmlFor="userAge">年齡</label>
	              </div>
	              <div className="form-value">
	                <input 
	                	id="userAge" 
	                	type="number" 
	                	onChange={this.onChangeAge}
	                	value={quest.age}
	                />
	              </div>
	            </div>

	            { this.renderSex() }
	          </form>
					</div>
      	</div>

      	<div className="footer-control-wrap">
	        <a 
	        	className="btn btn-icon-round btn-blue" 
	        	type="button"
	        	onClick={this.confirm}
	        >
	          <div className='icon-round-bkg'><i className="mdi mdi-check-circle-outline"></i></div>
	          <span>確認</span>
	        </a>
	      </div>
			</div>
		)
	}
}

export default Quest;