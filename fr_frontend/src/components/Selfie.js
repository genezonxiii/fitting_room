import React from "react";
import Webcam from "react-webcam";
import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
import Popup from "./Popup";
import * as CONSTANT from './constant';

const axios = require('axios');
 
class Selfie extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      msgList: {
        msg1: false,
        msg2: false,
        msg3: false
      },
			selfie: ''
		}

    this.handleChoose = this.handleChoose.bind(this);
    this.recognize = this.recognize.bind(this);
    this.confirmMsg1 = this.confirmMsg1.bind(this);
    this.confirmMsg2 = this.confirmMsg2.bind(this);
    this.confirmMsg3 = this.confirmMsg3.bind(this);
    this.renderMsg1 = this.renderMsg1.bind(this);
    this.renderMsg2 = this.renderMsg2.bind(this);
    this.renderMsg3 = this.renderMsg3.bind(this);
	}

  setRef = webcam => {
    this.webcam = webcam;
  };
 
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({selfie: imageSrc});

    const selfie = {
      mobile: this.props.user.mobile,
      data: imageSrc
    }

    const self = this; 

    // upload photo
    axios.post(`${CONSTANT.WS_URL}/api/selfie`, selfie)
      .then(function(response) {
        // handle success
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  recognize() {
    const mobile = this.props.user.mobile;
    const self = this; 

    axios.post(`${CONSTANT.WS_URL}/api/recognize`, {"mobile": `${mobile}`})
      .then(function(response) {
        // handle success
        if (response.data.people.length > 0) {
          const result = response.data.people[0];
          self.handleChoose(result.Gender.substr(0,1), result.Age);
        } else {
          self.confirmMsg3();
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
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
          method: 'selfie',
          sex: result.sex,
          age: result.age,
          sex_hide: '',
          age_hide: age,
          persona: result.persona
        };

        self.props.choose(data);
        self.props.confirm();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  confirmMsg1() {
    const { selfie, msgList } = this.state;

    if(selfie === '') {
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
        msg="請按鈕拍照！"
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
      // this.props.confirm();
      this.recognize();
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
        msg="是否送出辨識？辨識後，將挑選一位符合您風格的人物！"
        btns={{ok:true, cancel: true}}
        ok={handelOK}
        cancel={handelCancel}
      />
    )
  }

  confirmMsg3() {
    const { msgList } = this.state;

    this.setState({
      msgList: {
        ...msgList,
        msg3: true
      }
    })
  }

  renderMsg3() {
    const { msgList } = this.state;

    const handelOK = (e) => {
      this.setState({
        msgList: {
          ...msgList,
          msg3: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg3}
        msg="無法辨識，請重新拍照，謝謝！"
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }
 
  render() {
    const { msgList } = this.state;
    const videoConstraints = {
      width: 960,
      height: 720,
      facingMode: "user"
    };
 
    return (
      <div className="page-body">

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />

        <HomeNav title="拍照" handleHome={this.props.handleHome} />

        <div className="take-photo-wrap">
          
          <div className="photo-capture-wrap">
            <div className="photo-section-inner">
              <Webcam
                audio={false}
                ref={this.setRef}
                width={'100%'}
                height={'100%'}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <a 
                className="btn btn-take-photo" 
                type="button"
                onClick={this.capture}
              >
                <i className="mdi mdi-camera"></i>
              </a>
            </div>
          </div>

          <div className="photo-preview-wrap">
            <div className="photo-section-inner">
              <img 
                src={this.state.selfie || ''} 
                alt={this.state.selfie || ''} 
              />
            </div>
          </div>
        </div>

        <div className="footer-control-wrap">
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
        { msgList.msg3?this.renderMsg3():null }
      </div>
    );
  }
}

export default Selfie;
