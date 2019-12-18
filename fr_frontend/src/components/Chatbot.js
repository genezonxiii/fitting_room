import React, { Component } from "react";

class Chatbot extends Component {
  constructor(props) {
    super(props)

    this.state = {
      flag: false
    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({
      flag: true,
      link: "https://sbi1.cdri.org.tw/chatbot"
    })
  }

  close() {
    this.setState({
      flag: false,
      link: ""
    })
  }

  render() {
    const { flag, link } = this.state;
    return (
      <div>
        <a
          className="btn-chatbot"
          onClick={this.open}
        >
          <img src="images/chatbot-icon.svg" alt=""/>
        </a>

        <div 
          className="chatbot-window"
          className={ flag?'chatbot-window active':'chatbot-window' }
        >
          <div className="chatbot-window-inner">
            <iframe src={link} frameborder="0"></iframe>
            <a 
              className="btn-chatbotClose"
              onClick={this.close}
            >
              <i className="mdi mdi-close"></i>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Chatbot;