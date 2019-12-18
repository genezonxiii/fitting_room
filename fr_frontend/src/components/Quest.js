import React, { Component } from "react";
import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
import Popup from "./Popup";
import Chatbot from "./Chatbot";
import imgManBody from "./../images/man-body-silhouette.png";
import imgWomanBody from "./../images/woman-body-silhouette.png";
import imgBody from "./../images/body-silhouette.png";
import * as CONSTANT from './constant';

const axios = require('axios');
const data = [{
	id: 'figureM',
	value: 'M',
	label: '男',
	img: imgManBody
}, {
	id: 'figureF',
	value: 'F',
	label: '女',
	img: imgWomanBody
}, {
	id: 'figureX',
	value: 'X',
	label: '不提供',
	img: imgBody
}];

class Quest extends Component {
	constructor(props) {
		super(props)
		const defData = data[1];
		this.state = {
      msgList: {
        msg1: false,
        msg2: false
      },
			figure: defData.img,
			quest: {
				age: '',
				sex: defData.value
			}
		}
		this.onChangeAge = this.onChangeAge.bind(this);
		this.onChangeSex = this.onChangeSex.bind(this);
		this.handleChoose = this.handleChoose.bind(this);
		this.renderSex = this.renderSex.bind(this);
		this.renderFigure = this.renderFigure.bind(this);
    this.confirmMsg1 = this.confirmMsg1.bind(this);
    this.confirmMsg2 = this.confirmMsg2.bind(this);
    this.renderMsg1 = this.renderMsg1.bind(this);
    this.renderMsg2 = this.renderMsg2.bind(this);
	}

	onChangeAge (e) {
		this.handleChoose(this.state.quest.sex, e.target.value);
		this.setState({ quest: { ...this.state.quest, age: e.target.value} })
	}

	onChangeSex (e) {
		this.handleChoose(e.target.getAttribute('data-key'), this.state.quest.age);
		this.setState({ 
			figure: e.target.getAttribute('data-img'),
			quest: { 
				...this.state.quest, 
				sex: e.target.getAttribute('data-key')
			} 
		})
	}

	handleChoose(sex, age) {
		if(!age){ return; }

		const self = this;
		const real_sex = sex === 'X'?'F':sex;

		axios.get(`${CONSTANT.WS_URL}/api/model/age/${real_sex}/${age}`)
      .then(function(response) {
        // handle success
        const result = response.data[0];
        const data = {
          model: result.photo,
          model_id: result.model_id,
          method: 'quest',
          sex: result.sex,
          age: age,
          sex_hide: sex,
          age_hide: null,
          persona: result.persona
        };

        self.props.choose(data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
	}

	renderFigure(){
		const { figure } = this.state;
		return (
      <div className="figure-section">
        <div className="figure-fitting-wrap">
          <img 
          	className="fitting-figure" 
          	src={figure} 
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

	confirmMsg1() {
    const { quest, msgList } = this.state;

    if(quest.age === '' || quest.sex === '') {
      this.setState({
        msgList: {
          ...msgList,
          msg1: true
        }
      })
    } else {
      this.confirmMsg2();
    }
  }

  renderMsg1() {
    const { msgList } = this.state;

    const handelOK = (e) => {
      this.setState({
        msgList: {
          ...msgList,
          msg1: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg1}
        msg="請填寫年齡欄位！"
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }

  confirmMsg2() {
    this.setState({
      msgList: {
        ...this.state.msgList,
        msg2: true
      }
    })
  }

  renderMsg2() {
    const { msgList } = this.state;

    const handelOK = (e) => {
      this.props.confirm();
      this.setState({
        msgList: {
          ...msgList,
          msg2: false
        }
      })
    }

    const handelCancel = (e) => {
      this.setState({
        msgList: {
          ...msgList,
          msg2: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg2}
        msg="是否使用此設定，挑選一位符合您風格的人物！"
        btns={{ok:true, cancel: true}}
        ok={handelOK}
        cancel={handelCancel}
      />
    )
  }

	render() {
		const { quest, msgList } = this.state;
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

      	<div className="footer-control-wrap footer-float">
	        <a 
	        	className="btn btn-icon-round" 
	        	type="button"
	        	onClick={this.confirmMsg1}
	        >
	          <div className='icon-round-bkg'><i className="mdi mdi-check-circle-outline"></i></div>
	          <span>確認</span>
	        </a>
	      </div>

	      { msgList.msg1?this.renderMsg1():null }
	      { msgList.msg2?this.renderMsg2():null }
        <Chatbot/>
			</div>
		)
	}
}

export default Quest;