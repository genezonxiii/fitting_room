import React from "react";

import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
import Figure from "./Figure";
import ClothTabs from "./ClothTabs";
import TabContent from "./TabContent";
import ClothInfo from "./ClothInfo";
import Popup from "./Popup";

import tabClothes from "./../images/tab-icon_clothes.png";
import tabPants from "./../images/tab-icon_pants.png";
import tabDress from "./../images/tab-icon_dress.png";
import tabShoes from "./../images/tab-icon_shoes.png";
import * as CONSTANT from './constant';

const axios = require('axios');
 
class TryOn extends React.Component {
  constructor(props) {
    super(props)
    const { sex, model } = this.props;

    this.state = {
      sex: sex,
      model: model,
      outfit: {
        cloth: {},
        pants: {},
        dress: {},
        shoes: {}
      },
      clothList: [],
      pantsList: [],
      dressList: [],
      shoesList: [],
      clothTabs: {
        active: 0,
        tabs: [
          {tab: "#tabs-1", src: tabClothes, desc: "上衣", kind: "cloth"},
          {tab: "#tabs-2", src: tabPants, desc: "褲/裙", kind: "pants"},
          {tab: "#tabs-3", src: tabDress, desc: "洋裝", kind: "dress"},
          {tab: "#tabs-4", src: tabShoes, desc: "鞋子", kind: "shoes"}
        ]
      },
      msgList: {
        msg1: false
      }
    }

    this.getProductList = this.getProductList.bind(this);
    this.handleClothOffClick = this.handleClothOffClick.bind(this);
    this.handlePantsOffClick = this.handlePantsOffClick.bind(this);
    this.handleDressOffClick = this.handleDressOffClick.bind(this);
    this.handleShoesOffClick = this.handleShoesOffClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.confirm = this.confirm.bind(this);
    this.confirmMsg1 = this.confirmMsg1.bind(this);
    this.renderMsg1 = this.renderMsg1.bind(this);
  }

  componentDidMount () {
    const cloth = 'cloth', pants = 'pants', dress = 'dress', shoes = 'shoes';
    this.getProductList(cloth);
    this.getProductList(pants);
    this.getProductList(dress);
    this.getProductList(shoes);
  }

  getProductList(kind) {
    const { sex } = this.props;
    var self = this; 

    axios.get(`${CONSTANT.WS_URL}/api/product/list/${kind}/${sex}`)
      .then(function(response) {
        // handle success
        switch (kind) {
          case 'cloth':
            self.setState({
              clothList: response.data
            });
            break;
          case 'pants':
            self.setState({
              pantsList: response.data
            });
            break;
          case 'dress':
            self.setState({
              dressList: response.data
            });
            break;
          case 'shoes':
            self.setState({
              shoesList: response.data
            });
            break;
          default:
            break;
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

  handleClothOffClick(e) {
    this.setState({
      outfit: { 
        ...this.state.outfit, 
        cloth: {}
      }
    })
  }

  handlePantsOffClick(e) {
    this.setState({
      outfit: { 
        ...this.state.outfit, 
        pants: {}
      }
    })
  }

  handleDressOffClick(e) {
    this.setState({
      outfit: { 
        ...this.state.outfit, 
        dress: {}
      }
    })
  }

  handleShoesOffClick(e) {
    this.setState({
      outfit: { 
        ...this.state.outfit, 
        shoes: {}
      }
    })
  }

  handleTabClick(e) {
    this.setState({
      clothTabs: {
        ...this.state.clothTabs, 
        active: parseInt(e.target.getAttribute('data-key'))
      }
    })
  }

  confirm() {
    const { outfit } = this.state;
    this.props.confirm(outfit);
  }

  renderControl() {
    return (
      <div className="footer-control-wrap">
        <a
          className="btn btn-icon-round btn-red" 
          type="button"
        >
          <div className='icon-round-bkg'><i className="mdi mdi-delete"></i></div>
          <span>清空試衣籃</span>
        </a>
        <a 
          className="btn btn-icon-round btn-yellow" 
          type="button"
          onClick={this.confirmMsg1}
        >
          <div className='icon-round-bkg'><i className="mdi mdi-tshirt-crew-outline"></i></div>
          <span>我要試穿</span>
        </a>
      </div>
    )
  }

  confirmMsg1() {
    const { outfit, msgList } = this.state;

    if( !outfit.cloth.product_id 
        && !outfit.pants.product_id 
        && !outfit.dress.product_id ) {
      this.setState({
        msgList: {
          ...msgList,
          msg1: true
        }
      })
    } else {
      this.confirm();
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
        msg="請您至少挑選一件試穿的衣物！(鞋子除外)"
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }
 
  render() {
    const { model, outfit, clothList, pantsList, dressList, shoesList, clothTabs, msgList } = this.state;

    const handleClothOnClick = (e) => {
      const { clothList } = this.state;
      const id = e.target.getAttribute('data-key');
      let cloth = clothList.find((item)=>{
        return item.product_id.toString() === id;
      });

      this.setState({
        outfit: { 
          ...this.state.outfit, 
          cloth: cloth
        }
      })
    } 

    const handlePantsOnClick = (e) => {
      const { pantsList } = this.state;
      const id = e.target.getAttribute('data-key');
      let pants = pantsList.find((item)=>{
        return item.product_id.toString() === id;
      });

      this.setState({
        outfit: { 
          ...this.state.outfit, 
          pants: pants
        }
      })
    } 

    const handleDressOnClick = (e) => {
      const { dressList } = this.state;
      const id = e.target.getAttribute('data-key');
      let dress = dressList.find((item)=>{
        return item.product_id.toString() === id;
      });

      this.setState({
        outfit: { 
          ...this.state.outfit, 
          dress: dress
        }
      })
    }

    const handleShoesOnClick = (e) => {
      const { shoesList } = this.state;
      const id = e.target.getAttribute('data-key');
      let shoes = shoesList.find((item)=>{
        return item.product_id.toString() === id;
      });

      this.setState({
        outfit: { 
          ...this.state.outfit, 
          shoes: shoes
        }
      })
    }

    return (
      <div className="page-body">
        <div className="bkg-circle-gray bkg-circle-big"></div>

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />
        
        <HomeNav title="我的試衣間" handleHome={this.props.handleHome} />

        <div className="fittingroom-wrap">
          <Figure
            model={model}
            outfit={outfit}
            handleClothOffClick={this.handleClothOffClick}
            handlePantsOffClick={this.handlePantsOffClick}
            handledressOffClick={this.handleDressOffClick}
            handleShoesOffClick={this.handleShoesOffClick}
          />

          <div className="clothes-info-section">

            <div className="clothes-tab-wrap">
              <ClothTabs
                clothTabs={clothTabs}
                handleTabClick={this.handleTabClick}
              />
            </div>

            <div className="tabs_container">
              {
                clothTabs.active === 0?
                <TabContent
                  id="#tabs-1"
                  list={clothList}
                  outfit={outfit.cloth}
                  handleClick={handleClothOnClick}
                />
                :null
              }
              {
                clothTabs.active === 1?
                <TabContent
                  id="#tabs-2"
                  list={pantsList}
                  outfit={outfit.pants}
                  handleClick={handlePantsOnClick}
                />
                :null
              }
              {
                clothTabs.active === 2?
                <TabContent
                  id="#tabs-3"
                  list={dressList}
                  outfit={outfit.dress}
                  handleClick={handleDressOnClick}
                />
                :null
              }
              {
                clothTabs.active === 3?
                <TabContent
                  id="#tabs-4"
                  list={shoesList}
                  outfit={outfit.shoes}
                  handleClick={handleShoesOnClick}
                />
                :null
              }
            </div>

            {
              clothTabs.active === 0 && outfit.cloth.product_id?
              <ClothInfo
                outfit={outfit.cloth}
              />
              :null
            }
            {
              clothTabs.active === 1 && outfit.pants.product_id?
              <ClothInfo
                outfit={outfit.pants}
              />
              :null
            }
            {
              clothTabs.active === 2 && outfit.shoes.product_id?
              <ClothInfo
                outfit={outfit.shoes}
              />
              :null
            }

          </div>
        </div>

        { this.renderControl() }
        { msgList.msg1?this.renderMsg1():null }
      </div>
    );
  }
}

export default TryOn;
