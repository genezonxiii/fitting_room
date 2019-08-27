import React from "react";
import Webcam from "react-webcam";
import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
 
class Selfie extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selfie: ''
		}
	}

  setRef = webcam => {
    this.webcam = webcam;
  };
 
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({selfie: imageSrc});
  };
 
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
 
    return (
      <div className="page-body">
        <div className="bkg-circle-pink bkg-circle-big"></div>
        <div className="bkg-circle-pink bkg-circle-small"></div>

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />

        <HomeNav title="拍照" handleHome={this.props.handleHome} />

        <div className="take-photo-wrap">
          
          <div className="photo-capture-section">
            <div className="photo-section-inner">
              <Webcam
                audio={false}
                height={500}
                width={420}
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <a 
                className="btn btn-icon-round btn-yellow" 
                type="button"
                onClick={this.capture}
              >
                <div className='icon-round-bkg'><i className="mdi mdi-camera"></i></div>
              </a>
            </div>
          </div>

          <div className="photo-preview-section">
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
            className="btn btn-icon-round btn-blue" 
            type="button"
            onClick={this.capture}
          >
            <div className='icon-round-bkg'><i className="mdi mdi-check-circle-outline"></i></div>
            <span>確認</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Selfie;
