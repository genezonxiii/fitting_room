import React from "react";

import HomeNav from "../HomeNav";
import UserInfo from "../UserInfo";
import Figure from "../Figure";
import ClothTabs from "../ClothTabs";
import TabContent from "../TabContent";
import ClothInfo from "../ClothInfo";

import "./TryOn.css";
import * as CONSTANT from '../constant';

const axios = require('axios');
 
class TryOn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      model: this.props.model,
      outfit: {
        cloth: {},
        pants: {}
      },
      clothList: [],
      pantsList: [],
      clothTabs: {
        active: 0,
        tabs: [
          {tab: "#tabs-1", src: "tab-icon_clothes.png", desc: "上衣", kind: "cloth"},
          {tab: "#tabs-2", src: "tab-icon_pants.png", desc: "褲/裙", kind: "pants"}
          // {tab: "#tabs-3", src: "tab-icon_dress.png", desc: "洋裝", kind: "onepiece"},
          // {tab: "#tabs-4", src: "tab-icon_shoes.png", desc: "鞋子"}
        ]
      }
    }

    this.getProductList = this.getProductList.bind(this);
    this.handleClothOffClick = this.handleClothOffClick.bind(this);
    this.handlePantsOffClick = this.handlePantsOffClick.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount () {
    const cloth = 'cloth', pants = 'pants';
    this.getProductList(cloth);
    this.getProductList(pants);
  }

  getProductList(kind) {
    var self = this; 

    axios.get(`${CONSTANT.WS_URL}/api/product/list/${kind}`)
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
          onClick={this.confirm}
        >
          <div className='icon-round-bkg'><i className="mdi mdi-tshirt-crew-outline"></i></div>
          <span>我要試穿</span>
        </a>
      </div>
    )
  }
 
  render() {
    const { model, outfit, clothList, pantsList, clothTabs } = this.state;

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
                clothTabs.active == 0?
                <TabContent
                  id="#tabs-1"
                  list={clothList}
                  outfit={outfit.cloth}
                  handleClick={handleClothOnClick}
                />
                :null
              }
              {
                clothTabs.active == 1?
                <TabContent
                  id="#tabs-2"
                  list={pantsList}
                  outfit={outfit.pants}
                  handleClick={handlePantsOnClick}
                />
                :null
              }
            </div>

            {
              clothTabs.active == 0 && outfit.cloth.product_id?
              <ClothInfo
                outfit={outfit.cloth}
              />
              :null
            }
            {
              clothTabs.active == 1 && outfit.pants.product_id?
              <ClothInfo
                outfit={outfit.pants}
              />
              :null
            }

          </div>
        </div>

        { this.renderControl() }
      </div>
    );
  }
}

export default TryOn;
