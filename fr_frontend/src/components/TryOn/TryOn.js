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
        cloth: '',
        pants: ''
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
        cloth: ''
      }
    })
  }

  handlePantsOffClick(e) {
    this.setState({
      outfit: { 
        ...this.state.outfit, 
        pants: ''
      }
    })
  }

  renderCloth(outfit) {
    return (
      <img 
        className="model"
        onClick={(e) => this.handleClothOffClick(e)}
        src={`http://localhost:3001/photo/cloth/${outfit.cloth}`} alt={`${outfit.cloth}`}
      />
    )
  }

  renderPants(outfit) {
    return (
      <img 
        className="model"
        onClick={(e) => this.handlePantsOffClick(e)}
        src={`http://localhost:3001/photo/pants/${outfit.pants}`} alt={`${outfit.pants}`}
      />
    )
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

    return (
      <div>
        <div className="slide-container">
          <img 
            className="model"
            src={`http://localhost:3001/photo/model/${model}`} alt={`${model}`}
          />
          { outfit.cloth? this.renderCloth(outfit):undefined }
          { outfit.pants? this.renderPants(outfit):undefined }
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
