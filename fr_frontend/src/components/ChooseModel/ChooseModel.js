import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ChooseModel.css";

const axios = require('axios');
 
class ChooseModel extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        modelList: []
      }

      this.getModelList = this.getModelList.bind(this);
  }

  componentDidMount () {
    const sex = 'F';
    this.getModelList(sex);
  }

  getModelList(sex) {
    var self = this; 

    axios.get(`http://localhost:3001/api/model/${sex}`)
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

  render() {
    const { modelList } = this.state;
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1
    };

    const imageClick = (e) => {
      this.props.choose(e.target.getAttribute('data-value'))
    } 

    return (
      <div>
        <div className="slide-container">
          <Slider {...settings}>
          {
            modelList.map(function(d, idx){
              return (
                <div key={`slide-${idx}`}>
                  <img 
                    className="model"
                    onClick={imageClick}
                    data-value={d.photo}
                    src={`http://localhost:3001/photo/model/${d.photo}`} alt={`${d.photo}`}
                  />
                </div>
              )
            })
          }
          </Slider>
        </div>
        <button onClick={this.props.confirm}>
          確認
        </button>
      </div>
    );
  }
}

export default ChooseModel;
