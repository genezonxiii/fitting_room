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
      model: 'shutterstock_1189496695.jpg',
      outfit: {
        cloth: '',
        pants: ''
      },
      clothList: [],
      pantsList: []
    }

    this.getProductList = this.getProductList.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount () {
    const cloth = 'cloth', pants = 'pants';
    this.getProductList(cloth);
    this.getProductList(pants);
  }

  getProductList(kind) {
    var self = this; 

    axios.get(`http://localhost:3001/api/product/${kind}`)
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

  confirm() {
    console.log(this.state);
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
      this.setState({
        outfit: { 
          ...this.state.outfit, 
          cloth: e.target.getAttribute('data-value')
        }
      })
    } 

    const handlePantsOnClick = (e) => {
      this.setState({
        outfit: { 
          ...this.state.outfit, 
          pants: e.target.getAttribute('data-value')
        }
      })
    } 

    const handleClothOffClick = (e) => {
      this.setState({
        outfit: { 
          ...this.state.outfit, 
          cloth: ''
        }
      })
    }

    const handlePantsOffClick = (e) => {
      this.setState({
        outfit: { 
          ...this.state.outfit, 
          pants: ''
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
          <img 
            className="model"
            onClick={(e) => handleClothOffClick(e)}
            src={`http://localhost:3001/photo/cloth/${outfit.cloth}`} alt={`${outfit.cloth}`}
          />
          <img 
            className="model"
            onClick={(e) => handlePantsOffClick(e)}
            src={`http://localhost:3001/photo/pants/${outfit.pants}`} alt={`${outfit.pants}`}
          />
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
                    data-value={d.photo}
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
                    data-value={d.photo}
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
