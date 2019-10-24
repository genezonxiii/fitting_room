import React from "react";
import ClothInfo from "./ClothInfo";
import * as CONSTANT from './constant';

function Popup3DInfo(props) {
  const { active, clothTabs, outfit, btns, ok, cancel } = props;

  return (
    <div>
      <div className={ active?'modal-mask open':'modal-mask' } ></div>
      <div className={ active?'modal-wrap modal-wrap-wide open':'modal-wrap modal-wrap-wide' } >
        <div className="modal-content txt-center">
          <div className="clothes-preview-wrap">
            <div className="clothes-preview-img">
              {
                active && outfit?
                <img 
                  src={ `${CONSTANT.WS_URL}/photo/${outfit.kind}/3d/${outfit.photo3d}` }
                  alt=""
                />:null
              }
            </div>
            <div className="clothes-preview-content">
              <ClothInfo
                  outfit={ outfit }
              />
              <div className="modal-btn-wrap">
                {
                  btns && btns.ok?
                  <a 
                    className="modal-btn btn-primary-dark txt-bold"
                    onClick={ ok }
                  >購買網站
                  </a>
                  :null
                }
                {
                  btns && btns.cancel?
                  <a 
                    className="modal-btn btn-gray btn-close-modal"
                    onClick={ cancel }
                  >
                    取消
                  </a>
                  :null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup3DInfo;
