import React from "react";
import Webcam from "react-webcam";
 
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
      <div>
	        <div>
		        <Webcam
		          audio={false}
		          height={350}
		          width={350}
		          ref={this.setRef}
		          screenshotFormat="image/jpeg"
		          videoConstraints={videoConstraints}
		        />
		        <button onClick={this.capture}>
		        	拍照
		        </button>
		        </div>
	        <div>
          <img 
          	src={this.state.selfie || ''} 
          	alt={this.state.selfie || ''} 
          />
        </div>
      </div>
    );
  }
}

export default Selfie;
