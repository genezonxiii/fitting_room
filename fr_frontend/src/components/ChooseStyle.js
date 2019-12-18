import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";
import iconTakePhoto from "./../images/icon_take-photo.svg";
import iconChooseByself from "./../images/icon_choose-byself.svg";
import iconFillForm from "./../images/icon_fill-form.svg";

function ChooseStyle() {
  return (
    <div className="page-body">
      <h2 className="clothes-select-title">選擇您的風格</h2>

      <div className="clothes-select-wrap">
        
        <div className="clothes-select-section take-photo">
          <Link 
            to="selfie"
            className="clothes-select-btn"
          >
            <img 
              src={iconTakePhoto}
              alt=""
            />
          </Link>
          <span className="clothes-select-btn-name">
            拍照
          </span>
        </div>

        <div className="clothes-select-section choose-byself">
          <Link 
            to="chooseModel"
            className="clothes-select-btn"
          >
            <img 
              src={iconChooseByself}
              alt=""
            />
          </Link>
          <span className="clothes-select-btn-name">
            自行選擇
          </span>
        </div>

        <div className="clothes-select-section fill-form">
          <Link 
            to="quest" 
            className="clothes-select-btn">
            <img 
              src={iconFillForm}
              alt=""
            />
          </Link>
          <span className="clothes-select-btn-name">
            填寫資料
          </span>
        </div>

      </div>
      <Chatbot/>
    </div>
  )
}

export default ChooseStyle;