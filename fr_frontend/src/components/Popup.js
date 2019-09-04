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
          <a 
            className="modal-btn btn-blue txt-bold"
            onClick={props.ok}
          >
            確定
          </a>
          <a 
            className="modal-btn btn-gray btn-close-modal"
            onClick={props.cancel}
          >
            取消
          </a>
        </div>
      </div>
    </div>
  )
}

export default Popup;
