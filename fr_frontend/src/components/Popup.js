import React from "react";
import iconWarning from "./../images/icon_warning.png";

function Popup(props) {
  return (
    <div>
      <div 
        className={props.active?'modal-mask open':'modal-mask'}
      >
      </div>
      <div 
        className={props.active?'modal-wrap open':'modal-wrap'}
      >
        <div className="modal-content txt-center">
          <img 
            src={iconWarning}
            alt=""
          />
          <p>{props.msg}</p>
        </div>
        <div className="modal-footer">
          <div className="modal-btn-wrap">
            {
              props.btns && props.btns.ok?
              <a 
                className="modal-btn btn-primary-dark txt-bold"
                onClick={props.ok}
              >確定
              </a>
              :null
            }
            {
              props.btns && props.btns.cancel?
              <a 
                className="modal-btn btn-gray btn-close-modal"
                onClick={props.cancel}
              >
                取消
              </a>
              :null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup;
