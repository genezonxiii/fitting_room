import React from "react";
import Swiper from 'react-id-swiper';

import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
import Popup from "./Popup";
import * as CONSTANT from './constant';

const axios = require('axios');
 
class ChooseModel extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        msgList: {
          msg1: false
        },
        modelList: []
      }

      this.getModelList = this.getModelList.bind(this);
      this.confirmMsg1 = this.confirmMsg1.bind(this);
      this.renderMsg1 = this.renderMsg1.bind(this);
  }

  componentDidMount () {
    const sex = 'all';
    this.getModelList(sex);
  }

  getModelList(sex) {
    var self = this; 

    axios.get(`${CONSTANT.WS_URL}/api/model/${sex}`)
      .then(function(response) {
        // handle success
        self.setState({
          modelList: response.data
        })
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
    const { orderList, finalOrderList, msgList } = this.state;

    if(this.props.model === '') {
      this.setState({
        msgList: {
          ...msgList,
          msg1: true
        }
      })
    } else {
      this.props.confirm();
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
        msg="請挑選一位符合您風格的人物！"
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }

  render() {
    const { modelList, msgList } = this.state;
    const self = this;

    const params = {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      loop: true,
      loopFillGroupWithBlank: true,
      shouldSwiperUpdate: true,
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }

    const imageClick = (e) => {
      this.props.choose(e.target.getAttribute('data-sex'), e.target.getAttribute('data-value'));
    } 

    return (
      <div className="page-body">
        <div className="bkg-circle-green bkg-circle-big"></div>
        <div className="bkg-circle-green bkg-circle-small"></div>

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />

        <HomeNav title="自行選擇" handleHome={this.props.handleHome} />

        <div className="choose-byself-wrap">

          <Swiper {...params}>
          {
            modelList.map(function(d, idx){
              return (
                <div 
                  key={`slide-${idx}`}
                >
                  <div 
                    className="clothes-figure-wrap" 
                    data-sex={d.sex}
                    data-value={d.photo} 
                    onClick={imageClick}
                  >
                    <img 
                      className="model"
                      src={`${CONSTANT.WS_URL}/photo/model/${d.photo}`} alt={`${d.photo}`}
                      data-sex={d.sex}
                      data-value={d.photo}
                    />
                    <a 
                      className={self.props.model === d.photo?'btn-choose-figure active':'btn-choose-figure'}
                      data-sex={d.sex}
                      data-value={d.photo}
                    >
                      <i 
                        className="mdi mdi-heart"
                        data-sex={d.sex}
                        data-value={d.photo}
                      >
                      </i>
                    </a>
                  </div>
                </div>
              )
            })
          }
          </Swiper>

        </div>

        <div className="footer-control-wrap">
          <a 
            className="btn btn-icon-round btn-blue" 
            type="button"
            onClick={this.confirmMsg1}
          >
            <div className='icon-round-bkg'><i className="mdi mdi-check-circle-outline"></i></div>
            <span>符合風格</span>
          </a>
        </div>

        { msgList.msg1?this.renderMsg1():null }
      </div>
    );
  }
}

export default ChooseModel;
