import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TryOn.css";

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
      pantsList: []
    }

    this.getProductList = this.getProductList.bind(this);
    this.handleClothOffClick = this.handleClothOffClick.bind(this);
    this.handlePantsOffClick = this.handlePantsOffClick.bind(this);
    this.renderCloth = this.renderCloth.bind(this);
    this.renderPants = this.renderPants.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount () {
    const cloth = 'cloth', pants = 'pants';
    this.getProductList(cloth);
    this.getProductList(pants);
  }

  getProductList(kind) {
    var self = this; 

    axios.get(`http://localhost:3001/api/product/list/${kind}`)
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

  renderCloth(outfit) {
    return (
      <img 
        className="model"
        onClick={(e) => this.handleClothOffClick(e)}
        src={`http://localhost:3001/photo/cloth/${outfit.cloth.photo}`} alt={`${outfit.cloth.photo}`}
      />
    )
  }

  renderPants(outfit) {
    return (
      <img 
        className="model"
        onClick={(e) => this.handlePantsOffClick(e)}
        src={`http://localhost:3001/photo/pants/${outfit.pants.photo}`} alt={`${outfit.pants.photo}`}
      />
    )
  }

  confirm() {
    const { outfit } = this.state;
    this.props.confirm(outfit);
  }
 
  render() {
    const { model, outfit, clothList, pantsList } = this.state;
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1
    };

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
      <div>
        <div className="slide-container">
          <img 
            className="model"
            src={`http://localhost:3001/photo/model/${model}`} alt={`${model}`}
          />
          { outfit.cloth && outfit.cloth.product_id? this.renderCloth(outfit):undefined }
          { outfit.pants && outfit.pants.product_id? this.renderPants(outfit):undefined }
        </div>
        <div className="slide-container">
          <Slider {...settings}>
          {
            clothList.map(function(d, idx){
              return (
                <div key={`s-cloth-${idx}`}>
                  <img 
                    className="model"
                    onClick={(e) => handleClothOnClick(e)}
                    data-key={d.product_id}
                    src={`http://localhost:3001/photo/cloth/${d.photo}`} alt={`${d.photo}`}
                  />
                </div>
              )
            })
          }
          </Slider>
        </div>
        <div className="slide-container">
          <Slider {...settings}>
          {
            pantsList.map(function(d, idx){
              return (
                <div key={`s-pants-${idx}`}>
                  <img 
                    className="model"
                    onClick={(e) => handlePantsOnClick(e)}
                    data-key={d.product_id}
                    src={`http://localhost:3001/photo/pants/${d.photo}`} alt={`${d.photo}`}
                  />
                </div>
              )
            })
          }
          </Slider>
        </div>
        <button onClick={this.confirm}>
          確認
        </button>
      </div>
    );
  }
}

export default TryOn;
